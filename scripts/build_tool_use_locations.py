#!/usr/bin/env python3
"""Place traced tool-use consumers on terrain rendered from the same ROM."""
import argparse, hashlib, json, struct
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
def loc(en, ja, th): return dict(en=en, ja=ja, th=th)
def build(rom):
    r = rom.read_bytes()
    if hashlib.sha1(r).hexdigest() != SHA1: raise ValueError('Requires the matching original Japanese ROM')
    manifest = json.loads((ROOT/'catalogue/maps/rom-map-manifest.json').read_text())
    if manifest['provenance']['romSha1'] != SHA1: raise ValueError('Field maps belong to a different ROM')
    points = [
        ('cow', 3, 0x0C, ['0F','10'], loc('Cow: refill the empty bottle', '牛：空きビンに牛乳を入れる', 'คุยกับวัวเพื่อเติมนมใส่ขวดเปล่า'), '00:C804..C83B'),
        ('canoe-maker', 3, 0x1A, ['10','02'], loc('Canoe maker: trade milk for a canoe', 'カヌー職人：牛乳とカヌーを交換', 'คนทำเรือ: นำนมมาแลกเรือแคนู'), '00:C8D4..C911'),
        ('lottery-counter', 5, 0x18, ['11'], loc('Lottery drawing counter', '富くじの抽選所', 'เคาน์เตอร์ขึ้นสลาก'), '00:CBD9..CCD4'),
        ('jizo', 5, 0x08, ['11'], loc('Jizo: offer food to raise the lottery threshold', 'お地蔵さま：食べ物を供えて抽選の判定値を上げる', 'รูปปั้นจิโซ: ถวายอาหารเพิ่มค่าเกณฑ์ถูกรางวัล'), '00:C1E8..C1F7; 03:A3DF..A43B'),
        ('candle', 6, 0x22, ['12'], loc('Give the candle for the reunion event', '再会イベントのロウソクを渡す', 'คุยเพื่อให้เทียนและทำเควสต์ส่งสัญญาณ'), '00:CE4E..CE9E'),
        ('fox', 4, 0x0C, ['15','16'], loc('Fox event: give fried tofu or use fireworks nearby', 'キツネのイベント：あぶらあげを渡す／近くで花火を使う', 'จุดเควสต์จิ้งจอก: ให้เต้าหู้ทอด หรือใช้ดอกไม้ไฟบริเวณนี้'), '00:C9D7..CA62; 03:C62A..C664'),
        ('fireworks-hint', 4, 0x1E, ['16'], loc('NPC accepts fireworks and gives the fox hint', '花火を受け取りキツネの助言をする人物', 'NPC รับดอกไม้ไฟและบอกใบ้เรื่องจิ้งจอก'), '00:CAF6..CB1D'),
    ]
    result = {}
    for key, stage, slot, ids, name, consumer in points:
        pointer = struct.unpack_from('<H', r, 0x3D76+2*(stage-1))[0]
        source = pointer-0x8000+2*(slot-8)
        x,y = struct.unpack_from('<HH',r,source)
        m = manifest['mapSets'][f'mapSet{stage:02}']['fieldMap']
        terrain_path = ROOT/'catalogue/maps'/m['image']
        if hashlib.sha256(terrain_path.read_bytes()).hexdigest() != m['sha256']: raise ValueError(f'Field image differs from manifest: {key}')
        im = Image.open(terrain_path).convert('RGB')
        projection = m['worldToMapPixel']
        px = x*projection['scaleX']+projection['offsetX']
        py = y*projection['scaleY']+projection['offsetY']
        if not (0 <= px < im.width and 0 <= py < im.height): raise ValueError(f'Outside field map: {key}')
        w,h = min(384,im.width),min(384,im.height)
        x0,y0 = max(0,min(im.width-w,px-w//2)),max(0,min(im.height-h,py-h//2))
        image = f'maps/tool-use-{key}.png'
        im.crop((x0,y0,x0+w,y0+h)).save(ROOT/'catalogue'/image)
        entry = dict(stage=stage, name=name, tileX=x, tileY=y, image=image, fullImage='maps/'+m['image'], width=w, height=h,
                     pin=dict(x=(px-x0)/w,y=(py-y0)/h), source=dict(objectSlotHex=f'{slot:02X}',coordinateFileOffset=f'0x{source:06X}',consumer=consumer))
        if key == 'canoe-maker':
            entry['markerItem'] = dict(category='general_tool', id='10')
        if key == 'jizo':
            entry['markerItem'] = dict(category='food', id='07')
        if key == 'fox':
            entry['useWindow'] = dict(xMin=31,xMax=33,yMin=42,yMax=43)
        for item in ids: result.setdefault(item,[]).append(entry)
    # Town chest coordinates are in maps 7..12, never on outdoor fish terrain.
    towns_path = ROOT/'data/shop-locations-rom.json'
    if towns_path.exists():
        towns = json.loads(towns_path.read_text())
        if towns['rom']['sha1']!=SHA1: raise ValueError('Town maps belong to a different ROM')
        quest = json.loads((ROOT/'data/quest-tool-use.json').read_text())
        if quest['rom']['sha1'] != SHA1: raise ValueError('Quest trace belongs to a different ROM')
        bottle = quest['items']['0F']['rawTrace']['acquisition']
        chests = [(bottle, ['0F'], loc('Town chest: take the empty bottle before visiting the cow', '町の宝箱：牛を訪ねる前に空きビンを取る', 'หีบในเมือง: รับขวดเปล่าก่อนไปเติมนมกับวัว'), bottle['cpu'])]
        for chest in quest['items']['17']['rawTrace']['chests']:
            ids = ['17'] + (['12'] if chest['mapId']==12 else [])
            name = loc('Town chest: bring the key and leave room for the reward', '町の宝箱：カギを持参し、報酬用の空きを用意する', 'หีบในเมือง: พกกุญแจและเว้นช่องสำหรับรางวัลก่อนเปิด')
            chests.append((chest, ids, name, quest['items']['17']['rawTrace']['chestConsumer']))
        for chest, ids, name, consumer in chests:
            stage, town = int(chest['visibleArea']), int(chest['mapId'])
            town_area = next(a for a in towns['areas'] if int(a['townMapId'])==town)
            terrain = town_area['townTerrain']
            image_path = ROOT/'catalogue'/terrain['image']
            if hashlib.sha256(image_path.read_bytes()).hexdigest()!=terrain['sha256']: raise ValueError('Town image differs from its ROM manifest')
            im = Image.open(image_path).convert('RGB')
            x,y = chest['xy']
            pointer = struct.unpack_from('<H',r,0x3D76+2*(town-1))[0]
            offset = pointer-0x8000+2*(0x0E-8)
            if struct.unpack_from('<HH',r,offset)!=(x,y): raise ValueError('Town chest coordinate mismatch')
            px,py = x*16+8,y*16+8
            if not(0<=px<im.width and 0<=py<im.height): raise ValueError('Chest outside town crop')
            w,h = min(384,im.width),min(384,im.height)
            x0,y0 = max(0,min(im.width-w,px-w//2)),max(0,min(im.height-h,py-h//2))
            image = f'maps/tool-use-town-chest-{town:02}.png'
            im.crop((x0,y0,x0+w,y0+h)).save(ROOT/'catalogue'/image)
            entry = dict(stage=stage,mapId=town,context='town',name=name,tileX=x,tileY=y,image=image,fullImage=terrain['image'],width=w,height=h,
                         pin=dict(x=(px-x0)/w,y=(py-y0)/h),source=dict(objectSlotHex='0E',coordinateFileOffset=f'0x{offset:06X}',consumer=consumer))
            paired = next((e for e in town_area['entrances'] if int(e['townArrival']['y'])//16==y//16),None)
            if paired:
                entry['townEntranceOrdinal']=int(paired['ordinal'])
                field = manifest['mapSets'][f'mapSet{stage:02}']['fieldMap']
                outside_path = ROOT/'catalogue/maps'/field['image']
                if hashlib.sha256(outside_path.read_bytes()).hexdigest()!=field['sha256']: raise ValueError('Entrance field image differs from manifest')
                outside = Image.open(outside_path).convert('RGB')
                ex,ey = paired['fieldTile']['x'],paired['fieldTile']['y']
                projection = field['worldToMapPixel']
                epX,epY = ex*projection['scaleX']+projection['offsetX'],ey*projection['scaleY']+projection['offsetY']
                ew,eh = min(384,outside.width),min(384,outside.height)
                ox,oy = max(0,min(outside.width-ew,epX-ew//2)),max(0,min(outside.height-eh,epY-eh//2))
                approach_image=f'maps/tool-entry-town-chest-{town:02}.png'
                outside.crop((ox,oy,ox+ew,oy+eh)).save(ROOT/'catalogue'/approach_image)
                entry['approach']=dict(image=approach_image,fullImage='maps/'+field['image'],width=ew,height=eh,tileX=ex,tileY=ey,pin=dict(x=(epX-ox)/ew,y=(epY-oy)/eh))
            if chest.get('reward'):
                reward = chest['reward'].split()
                entry['rewardItem']=dict(category='general_tool' if reward[0]=='candle' else reward[0],id=reward[1])
                entry['requiredItem']=dict(category='general_tool',id='17')
            for item in ids:
                if item in ['0F','12']: result.setdefault(item,[]).insert(0,entry)
                else: result.setdefault(item,[]).append(entry)
    output = dict(schemaVersion=1,rom=dict(sha1=SHA1),scope='NPC default positions from original-ROM object tables; item-use bindings from traced event consumers. Fireworks activation rectangle comes from 03:C63A..C65E. Terrain is rendered from the same original ROM.',items=result)
    (ROOT/'data/tool-use-locations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(points)} outdoor plus available town-chest tool/event locations for {len(result)} items')
if __name__ == '__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);a=p.parse_args();build(a.rom)
