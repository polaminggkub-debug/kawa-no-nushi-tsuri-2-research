#!/usr/bin/env python3
"""Map example magnifying-glass contexts from original-ROM terrain bytes."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image
from extract_shop_stock import decompress, word, SHA1
ROOT=Path(__file__).resolve().parents[1]
def loc(en,ja,th):return dict(en=en,ja=ja,th=th)
def build(path):
 rom=path.read_bytes()
 if hashlib.sha1(rom).hexdigest()!=SHA1:raise ValueError('Requires matching original ROM')
 manifest=json.loads((ROOT/'catalogue/maps/rom-map-manifest.json').read_text())
 locations=[]
 for stage in range(1,7):
  p=0x74a+stage*8;block=decompress(rom,(word(rom,p+2)&127)*32768+(word(rom,p)&32767))
  width=word(rom,0x9e7+block[0x300]*2)+1;height=word(rom,0x9e7+block[0x301]*2)+1
  bounds=[word(block,0x4b4d+i*2) for i in range(10)]
  cells={i:[] for i in range(1,6)}
  for y in range(height):
   for x in range(width):
    value=block[0xb02+y*width+x];kind=next((i for i in range(9,0,-1) if value>=bounds[i]),0)
    if kind in cells:cells[kind].append((x,y))
  def nearest(cx,cy):return [min(cells[k],key=lambda xy:(xy[0]-cx)**2+(xy[1]-cy)**2) for k in range(1,6)]
  candidates=[(x,y) for y in range(4,height-3,4) for x in range(4,width-3,4)]
  cx,cy=min(candidates,key=lambda c:sum((x-c[0])**2+(y-c[1])**2 for x,y in nearest(*c)))
  points=nearest(cx,cy)
  m=manifest['mapSets'][f'mapSet{stage:02}']['fieldMap'];terrain=ROOT/'catalogue/maps'/m['image']
  if hashlib.sha256(terrain.read_bytes()).hexdigest()!=m['sha256']:raise ValueError('Map differs from manifest')
  im=Image.open(terrain);pr=m['worldToMapPixel'];project=lambda x,y:(x*pr['scaleX']+pr['offsetX'],y*pr['scaleY']+pr['offsetY'])
  for kind,(x,y) in enumerate(points,1):
   ids={1:['01'],2:['11']if stage==3 else['01'],3:['02'],4:['0A','0B'],5:['04','0C']}[kind]
   px,py=project(x,y);w,h=min(384,im.width),min(384,im.height)
   left=max(0,min(im.width-w,int(px-w//2)));top=max(0,min(im.height-h,int(py-h//2)))
   image=f'maps/forage-{stage:02}-{kind}.png';im.crop((left,top,left+w,top+h)).save(ROOT/'catalogue'/image)
   locations.append(dict(stage=stage,forage=True,context=kind,name=loc('Example bait-search tile','エサ探しの地点例','ตัวอย่างจุดยืนหาเหยื่อ'),tileX=x,tileY=y,image=image,fullImage='maps/'+m['image'],width=w,height=h,pin=dict(x=(px-left)/w,y=(py-top)/h),markerItems=[dict(category='bait',id=i)for i in ids],source=dict(classifier='00:8F7D..8FEB',contextConsumer='03:D451..D49B',terrainOffset='7E:2B02',thresholdOffset='7E:6B4D')))
 output=dict(romSha1=SHA1,scope='Example terrain tiles that set magnifying-glass search context; not every possible search tile. Context persists across neutral tiles. Two bait icons mean alternative outcomes selected by the frame counter, not both rewards.',items={'03':locations})
 (ROOT/'data/forage-locations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n');print('Built 30 example context points on original-ROM terrain crops across six areas')
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);build(p.parse_args().rom)
