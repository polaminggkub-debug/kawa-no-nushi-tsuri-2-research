#!/usr/bin/env python3
"""Map example magnifying-glass contexts from original-ROM terrain bytes."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image
from extract_shop_stock import decompress, word, SHA1
ROOT=Path(__file__).resolve().parents[1]
def loc(en,ja,th):return dict(en=en,ja=ja,th=th)
# Dry-land tiles where the glass works (2026-10-07 audit); the other 25 earlier example tiles are swim/wading water.
VERIFIED={(3,5):(15,38),(5,2):(68,15),(5,3):(68,18),(5,4):(68,16),(6,4):(47,32)}
def cells_kind(block,width,bounds,x,y):
 value=block[0xb02+y*width+x];return next((i for i in range(9,0,-1) if value>=bounds[i]),0)
def build(path):
 rom=path.read_bytes()
 if hashlib.sha1(rom).hexdigest()!=SHA1:raise ValueError('Requires matching original ROM')
 manifest=json.loads((ROOT/'catalogue/maps/rom-map-manifest.json').read_text())
 locations=[]
 for stage in range(1,7):
  p=0x74a+stage*8;block=decompress(rom,(word(rom,p+2)&127)*32768+(word(rom,p)&32767))
  width=word(rom,0x9e7+block[0x300]*2)+1;height=word(rom,0x9e7+block[0x301]*2)+1
  bounds=[word(block,0x4b4d+i*2) for i in range(10)]
  points=[(kind,x,y) for (st,kind),(x,y) in VERIFIED.items() if st==stage]
  for kind,x,y in points:
   if cells_kind(block,width,bounds,x,y)!=kind:raise ValueError(f'Tile {x},{y} in area {stage} is not search context {kind}')
  m=manifest['mapSets'][f'mapSet{stage:02}']['fieldMap'];terrain=ROOT/'catalogue/maps'/m['image']
  if hashlib.sha256(terrain.read_bytes()).hexdigest()!=m['sha256']:raise ValueError('Map differs from manifest')
  im=Image.open(terrain);pr=m['worldToMapPixel'];project=lambda x,y:(x*pr['scaleX']+pr['offsetX'],y*pr['scaleY']+pr['offsetY'])
  for kind,x,y in points:
   ids={1:['01'],2:['11']if stage==3 else['01'],3:['02'],4:['0A','0B'],5:['04','0C']}[kind]
   px,py=project(x,y);w,h=min(384,im.width),min(384,im.height)
   left=max(0,min(im.width-w,int(px-w//2)));top=max(0,min(im.height-h,int(py-h//2)))
   image=f'maps/forage-{stage:02}-{kind}.png';im.crop((left,top,left+w,top+h)).save(ROOT/'catalogue'/image)
   locations.append(dict(stage=stage,forage=True,context=kind,name=loc('Dry-land bait-search tile','エサ探しができる陸地のタイル','จุดบนพื้นดินที่ค้นหาเหยื่อได้'),tileX=x,tileY=y,image=image,fullImage='maps/'+m['image'],width=w,height=h,pin=dict(x=(px-left)/w,y=(py-top)/h),markerItems=[dict(category='bait',id=i)for i in ids],source=dict(classifier='00:8F7D..8FEB',contextConsumer='03:D451..D49B',terrainOffset='7E:2B02',thresholdOffset='7E:6B4D')))
 output=dict(romSha1=SHA1,scope='Verified dry-land tiles where the magnifying glass can be used (stand on land, not in water); not every possible search tile. Context persists across neutral tiles. Two bait icons mean alternative outcomes selected by the frame counter, not both rewards.',items={'03':locations})
 (ROOT/'data/forage-locations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n');print(f'Built {len(locations)} verified dry-land search tiles')
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);build(p.parse_args().rom)
