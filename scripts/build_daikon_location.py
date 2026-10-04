#!/usr/bin/env python3
"""Project the traced Daikon NPC onto the existing original-ROM field image."""
import json, hashlib, struct, argparse
from pathlib import Path
from PIL import Image
from build_tool_use_locations import save_crop_if_changed
ROOT=Path(__file__).resolve().parents[1]
def build(rom):
    source=json.loads((ROOT/'data/daikon-acquisition.json').read_text())
    raw=rom.read_bytes()
    assert hashlib.sha1(raw).hexdigest()==source['romSha1']
    offset=int(source['npc']['romObjectRecord']['slotRecordFileOffset'],16)
    assert struct.unpack_from('<HH',raw,offset)==(source['npc']['tile']['x'],source['npc']['tile']['y'])
    handler=raw[0x4940:0x4981]
    assert bytes.fromhex('a9 18 00 8d e8 11 20 41 c6') in handler
    assert bytes.fromhex('a9 07 00 99 3a 0b c8 c8 c0 20 00 90 f3') in handler
    assert source['exchange']['mealSlotsWritten']==16 and not source['exchange']['repeatable']
    manifest=json.loads((ROOT/'catalogue/maps/rom-map-manifest.json').read_text())
    assert source['romSha1']==manifest['provenance']['romSha1']=='c2103dd94e2a1a65a495fc02adc2e7d040f31212'
    stage=source['npc']['stage']; x=source['npc']['tile']['x'];y=source['npc']['tile']['y']
    m=manifest['mapSets'][f'mapSet{stage:02}']['fieldMap']
    terrain=ROOT/'catalogue/maps'/m['image']
    assert hashlib.sha256(terrain.read_bytes()).hexdigest()==m['sha256']
    im=Image.open(terrain).convert('RGB'); p=m['worldToMapPixel']
    px=x*p['scaleX']+p['offsetX'];py=y*p['scaleY']+p['offsetY']
    assert 0<=px<im.width and 0<=py<im.height
    w,h=min(384,im.width),min(384,im.height)
    x0=max(0,min(im.width-w,px-w//2));y0=max(0,min(im.height-h,py-h//2))
    image='maps/food-daikon-exchange.png'
    save_crop_if_changed(im.crop((x0,y0,x0+w,y0+h)),ROOT/'catalogue'/image)
    entry=dict(stage=stage,tileX=x,tileY=y,image=image,fullImage='maps/'+m['image'],width=w,height=h,pin=dict(x=(px-x0)/w,y=(py-y0)/h),name=dict(en='Daikon exchange: bring a Yamanokami',ja='大根の交換：ヤマノカミを持参',th='จุดแลกหัวไชเท้า: นำปลายามาโนะคามิมา'),source=dict(data='data/daikon-acquisition.json',consumer='00:C940..C980'))
    (ROOT/'data/daikon-location.json').write_text(json.dumps(dict(romSha1=source['romSha1'],location=entry),ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--rom',type=Path,required=True)
    build(parser.parse_args().rom)
