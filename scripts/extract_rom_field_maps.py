#!/usr/bin/env python3
"""Reconstruct six terrain maps through the original ROM's field loader.

Supply your own original Japanese ROM, compatible Snes9x libretro core, and a
local save state in the outdoor field. No ROM/core/state is distributed.
Local WRAM/VRAM states are retained under --local-dir, outside the publication.
"""
import argparse,hashlib,json,shutil,subprocess,sys
from pathlib import Path
from PIL import Image
from render_field_snapshot import render,read_chunks
SHA1='c2103dd94e2a1a65a495fc02adc2e7d040f31212'
HERE=Path(__file__).resolve().parent

def word(r,a):return int.from_bytes(r[a:a+2],'little')
def pair(n):return [n&255,n>>8]
def run(args,stage,x,y,folder,dimensions=None):
    folder.mkdir(parents=True,exist_ok=True);state=folder/'capture.state';shutil.copyfile(args.transition_dir/f"stage-{stage-1 if stage>1 else 13}.state",state)
    tw,th=dimensions or (16,16)
    camera_x=max(0,min(max(0,tw*16-256),x*16-120))
    camera_y=max(0,min(max(0,th*16-232),y*16-104))
    writes=[['0x0838',pair(camera_x)],['0x083A',pair(camera_y)],['0x085A',pair(stage)],['0x085C',pair(x)],['0x085E',pair(y)],['0x0500',pair(x*16)],['0x0502',pair(y*16)],['0x0504',pair(x)],['0x0506',pair(y)]]
    request=folder/'request.json';request.write_text(json.dumps({'freezeAfterSteps':True,'steps':[{'write':[['0x1348',pair(0x8a80)],['0x134A',pair(0)]],'buttons':[0,4,6,8],'frames':3},{'buttons':[0,3,4,6,8],'until':{'address':'0x0834','equals':1,'size':2,'maxFrames':180}},{'write':writes,'until':{'address':'0x0834','equals':2,'size':2,'maxFrames':600},},{'frames':2,'image':'game-frame.png'}]}))
    subprocess.run([sys.executable,str(HERE/'capture.py'),'--rom',str(args.rom),'--core',str(args.core),'--request',str(request),'--state',str(state),'--output-dir',str(folder)],capture_output=True,check=True)
    chunks=read_chunks(state.read_bytes());ram=chunks['RAM']
    if word(ram,0x085A)!=stage or word(ram,0x04F4)!=stage or word(ram,0x0834)!=2:raise ValueError('Field setup did not preserve the requested stage')
    image,meta=render(state.read_bytes(),height=256,scanline_offset=0)
    meta.update({'stage':stage,'requestedTileX':x,'requestedTileY':y,'tileWidth':word(ram,0x024c)+1,'tileHeight':word(ram,0x024e)+1,'mapDescriptorHeader':list(ram[0x2300:0x2302])})
    image.save(folder/'terrain.png');return image,meta

def prepare_transitions(args):
    # The ROM's area-cycle debug branch first blanks video and disables NMI.
    # Entering state 1 directly while NMI is active corrupts graphics DMA.
    args.transition_dir=args.local_dir/'transition-states'
    args.transition_dir.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(args.field_state,args.transition_dir/'stage-1.state')
    ram=read_chunks(args.field_state.read_bytes())['RAM']
    if word(ram,0x085a)!=1 or word(ram,0x0834)!=2:
        raise ValueError('Supply an outdoor area-1 field state')
    for stage in range(2,14):
        state=args.transition_dir/f'stage-{stage}.state'
        shutil.copyfile(args.transition_dir/f'stage-{stage-1}.state',state)
        request=args.transition_dir/f'stage-{stage}.json'
        request.write_text(json.dumps({'steps':[{'write':[['0x1348',pair(0x8a80)],['0x134A',pair(0)]],'buttons':[0,4,6,8],'frames':3},{'buttons':[0,3,4,6,8],'frames':3},{'frames':160}]}))
        subprocess.run([sys.executable,str(HERE/'capture.py'),'--rom',str(args.rom),'--core',str(args.core),'--request',str(request),'--state',str(state),'--output-dir',str(args.transition_dir)],capture_output=True,check=True)
        ram=read_chunks(state.read_bytes())['RAM']
        if word(ram,0x085a)!=stage or word(ram,0x0834)!=2:
            raise ValueError(f'Original ROM area-cycle branch did not reach area {stage}')

def main():
    p=argparse.ArgumentParser(description=__doc__)
    for name in ['rom','core','field-state','local-dir','output-dir']:p.add_argument('--'+name,type=Path,required=True)
    p.add_argument('--stages',default='1,2,3,4,5,6');args=p.parse_args()
    if hashlib.sha1(args.rom.read_bytes()).hexdigest()!=SHA1:raise ValueError('Requires the matching original Japanese ROM')
    publication=HERE.parent.resolve()
    if args.local_dir.resolve().is_relative_to(publication):raise ValueError('Keep private emulator states outside the publication repository')
    args.output_dir.mkdir(parents=True,exist_ok=True);reports=[]
    prepare_transitions(args)
    for stage in map(int,args.stages.split(',')):
        if stage not in range(1,7):raise ValueError('Stage must be 1..6')
        _,first=run(args,stage,0,0,args.local_dir/f'stage-{stage}/descriptor')
        tw,th=first['tileWidth'],first['tileHeight']
        if tw*th!=4096:raise ValueError('Unexpected field dimensions')
        canvas=Image.new('RGB',(tw*16,th*16));coverage=Image.new('L',canvas.size);captures=[]
        xs=[7]+list(range(19,tw,12))+[tw-1];ys=[6]+list(range(18,th,12))+[th-1]
        # Boundary clamps make some requests share the same viewport origin.
        visited=set()
        for y in ys:
            for x in xs:
                image,meta=run(args,stage,x,y,args.local_dir/f'stage-{stage}/x{x}-y{y}',(tw,th))
                origin=(meta['cameraX'],meta['cameraY'])
                if origin in visited:continue
                visited.add(origin);cx,cy=origin;w=min(256,canvas.width-cx);h=min(248,canvas.height-cy)
                # The last eight cached rows are outside the refreshed window.
                canvas.paste(image.crop((0,0,w,h)),origin);coverage.paste(255,(cx,cy,cx+w,cy+h));captures.append(meta)
        if coverage.getextrema()!=(255,255):raise ValueError(f'Uncovered field pixels in stage {stage}')
        out=args.output_dir/f'rom-field-{stage:02d}.png';canvas.save(out)
        report={'stage':stage,'image':out.name,'width':canvas.width,'height':canvas.height,'tileWidth':tw,'tileHeight':th,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'projection':{'scaleX':16,'scaleY':16,'offsetX':8,'offsetY':8},'captures':captures}
        reports.append(report);(args.local_dir/'field-map-captures.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n');print(f'Stage {stage}: {canvas.width} x {canvas.height}, {len(captures)} viewports',flush=True)
    (args.output_dir/'rom-field-render-report.json').write_text(json.dumps({'romSha1':SHA1,'coreSha256':hashlib.sha256(args.core.read_bytes()).hexdigest(),'method':'Original ROM area-cycle transition with forced blank/NMI disable, field loader and decoded VRAM/PPU terrain; sprites omitted','maps':[{k:v for k,v in r.items() if k!='captures'} for r in reports]},indent=2)+'\n')
if __name__=='__main__':main()
