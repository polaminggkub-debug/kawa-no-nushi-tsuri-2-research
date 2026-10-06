#!/usr/bin/env python3
"""Place traced tool-use consumers on terrain rendered from the same ROM."""
import argparse, hashlib, json, struct
from pathlib import Path
from PIL import Image, ImageChops
ROOT = Path(__file__).resolve().parents[1]
SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
def loc(en, ja, th): return dict(en=en, ja=ja, th=th)
def save_crop_if_changed(image, path):
    """Keep existing authentic crops byte-stable when their pixels already match."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        try:
            current = Image.open(path).convert('RGB')
            if current.size == image.size and ImageChops.difference(current, image).getbbox() is None:
                return
        except OSError:
            pass
    image.save(path)

def cpu_offset(cpu):
    """Convert a LoROM bank:address string to a file offset."""
    bank_s, addr_s = cpu.split(':')
    bank, addr = int(bank_s, 16), int(addr_s, 16)
    if addr < 0x8000:
        raise ValueError(f'Not a LoROM ROM address: {cpu}')
    return (bank & 0x7F) * 0x8000 + (addr & 0x7FFF)

def build(rom):
    r = rom.read_bytes()
    if hashlib.sha1(r).hexdigest() != SHA1: raise ValueError('Requires the matching original Japanese ROM')
    manifest = json.loads((ROOT/'catalogue/maps/rom-map-manifest.json').read_text())
    if manifest['provenance']['romSha1'] != SHA1: raise ValueError('Field maps belong to a different ROM')
    points = [
        ('cow', 3, 0x0C, ['0F','10'], loc('Cow: refill the empty bottle', '牛：空きビンに牛乳を入れる', 'คุยกับวัวเพื่อเติมนมใส่ขวดเปล่า'), '00:C804..C83B'),
        ('canoe-maker', 3, 0x1A, ['10','02'], loc('Canoe maker: trade milk for a canoe', 'カヌー職人：牛乳とカヌーを交換', 'คนทำเรือ: นำนมมาแลกเรือแคนู'), '00:C8D4..C911'),
        ('lottery-counter', 5, 0x18, ['11'], loc('Lottery drawing counter', '富くじの抽選所', 'เคาน์เตอร์ขึ้นสลาก'), '00:CBD9..CCD4'),
        ('jizo', 5, 0x08, ['11'], loc('Offer spare food here before drawing', 'くじを引く前に余った食料を供える', 'ถวายอาหารที่เหลือก่อนขึ้นสลาก'), '00:C1E8..C1F7; 03:A3DF..A43B'),
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
        save_crop_if_changed(im.crop((x0,y0,x0+w,y0+h)), ROOT/'catalogue'/image)
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
        ticket = quest['items']['11']['rawTrace']['acquisition']
        chests = [
            (bottle, ['0F'], loc('Town chest: take the empty bottle before visiting the cow', '町の宝箱：牛を訪ねる前に空きビンを取る', 'หีบในเมือง: รับขวดเปล่าก่อนไปเติมนมกับวัว'), bottle['cpu']),
            (ticket, ['11'], loc('Town chest: take the lottery ticket; no key is needed', '町の宝箱：カギなしで富くじを入手', 'หีบในเมือง: รับสลากได้โดยไม่ต้องใช้กุญแจ'), ticket['cpu']),
        ]
        for chest in quest['items']['17']['rawTrace']['chests']:
            chest = dict(chest, requiresKey=True)
            ids = ['17'] + (['12'] if chest['mapId']==12 else [])
            name = loc('Town chest: bring the key and leave room for the reward', '町の宝箱：カギを持参し、報酬用の空きを用意する', 'หีบในเมือง: พกกุญแจและเว้นช่องสำหรับรางวัลก่อนเปิด')
            chests.append((chest, ids, name, quest['items']['17']['rawTrace']['chestConsumer']))
        acquisition_items = {}
        for chest, ids, name, consumer in chests:
            if chest is bottle:
                chest = dict(chest, requiresKey=False, reward='general_tool 0F milk bottle')
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
            if chest.get('slot', '0E').upper() != '0E': raise ValueError(f'Unexpected chest coordinate slot for map {town}')
            px,py = x*16+8,y*16+8
            if not(0<=px<im.width and 0<=py<im.height): raise ValueError('Chest outside town crop')
            w,h = min(384,im.width),min(384,im.height)
            x0,y0 = max(0,min(im.width-w,px-w//2)),max(0,min(im.height-h,py-h//2))
            image = f'maps/tool-use-town-chest-{town:02}.png'
            save_crop_if_changed(im.crop((x0,y0,x0+w,y0+h)), ROOT/'catalogue'/image)
            reward = chest.get('reward')
            reward_item = None
            if reward:
                reward_parts = reward.split()
                if len(reward_parts) < 2: raise ValueError(f'Unparseable chest reward on town map {town}: {reward}')
                reward_category, reward_id = reward_parts[:2]
                if reward_category in ('candle', 'item'): reward_category = 'general_tool'
                reward_item = dict(category=reward_category,id=reward_id.upper())
            elif len(ids) == 1 and ids[0] != '17':
                # The bottle and lottery ticket traces use their acquired item ID
                # as the target item list instead of a separate reward field.
                reward_item = dict(category='general_tool',id=ids[0].upper())
            required_item = dict(category='general_tool',id='17') if chest.get('requiresKey') else None
            acquisition_cpu = chest.get('cpu')
            if not acquisition_cpu and town == 11: acquisition_cpu = '00:D158..D181'
            if not acquisition_cpu and town == 9: acquisition_cpu = '00:D0EA..D113'
            if not acquisition_cpu and required_item: acquisition_cpu = consumer
            if reward_item:
                acquisition_copy = {
                    'general_tool:0F': (
                        loc('Town chest: empty bottle', '町の宝箱：空きビン', 'หีบในเมือง: ขวดเปล่า'),
                        loc('Take the empty bottle, then bring it to the area-3 cow at (6,103).', '空きビンを取り、エリア3の牛（6,103）へ持っていく。', 'รับขวดเปล่า แล้วนำไปหาวัวในด่าน 3 พิกัด (6,103)'),
                    ),
                    'general_tool:11': (
                        loc('Town chest: lottery ticket', '町の宝箱：富くじ', 'หีบในเมือง: สลาก'),
                        loc('Take the ticket; this chest does not require the key.', 'カギは不要。この宝箱から富くじを取る。', 'รับสลากจากหีบนี้ได้เลย ไม่ต้องใช้กุญแจ'),
                    ),
                    'bait:11': (
                        loc('Locked town chest: potato bait', '施錠された町の宝箱：イモエサ', 'หีบล็อกในเมือง: เหยื่อมันฝรั่ง'),
                        loc('Bring key 17 and leave a free bait slot before opening this chest.', 'カギ17を持ち、エサ欄を1つ空けてから開ける。', 'พกกุญแจ 17 และเว้นช่องเหยื่อให้ว่างก่อนเปิดหีบ'),
                    ),
                    'bait:0B': (
                        loc('Locked town chest: grapevine larva bait', '施錠された町の宝箱：ブドウムシ', 'หีบล็อกในเมือง: หนอนองุ่น'),
                        loc('Bring key 17 and leave a free bait slot before opening this chest.', 'カギ17を持ち、エサ欄を1つ空けてから開ける。', 'พกกุญแจ 17 และเว้นช่องเหยื่อให้ว่างก่อนเปิดหีบ'),
                    ),
                    'rod:0A': (
                        loc('Locked town chest: small lure rod', '施錠された町の宝箱：ルアーロッド小', 'หีบล็อกในเมือง: คันลัวร์เล็ก'),
                        loc('Bring key 17 and leave a free rod slot before opening this chest.', 'カギ17を持ち、竿欄を1つ空けてから開ける。', 'พกกุญแจ 17 และเว้นช่องคันเบ็ดให้ว่างก่อนเปิดหีบ'),
                    ),
                    'general_tool:12': (
                        loc('Locked town chest: candle', '施錠された町の宝箱：ロウソク', 'หีบล็อกในเมือง: เทียน'),
                        loc('Bring key 17 and leave a free general-tool slot before opening this chest.', 'カギ17を持ち、道具欄を1つ空けてから開ける。', 'พกกุญแจ 17 และเว้นช่องอุปกรณ์ทั่วไปให้ว่างก่อนเปิดหีบ'),
                    ),
                }
                composite_key = f"{reward_item['category']}:{reward_item['id']}"
                if composite_key in acquisition_copy:
                    name, action = acquisition_copy[composite_key]
                else:
                    action = loc('Open this town chest to obtain the listed item.', 'この町の宝箱を開けて表示されたアイテムを入手する。', 'เปิดหีบในเมืองนี้เพื่อรับไอเท็มที่ระบุ')
            else:
                action = loc('Use this location for the recorded item event.', '記録されたアイテムイベントでこの場所を使う。', 'ใช้ตำแหน่งนี้สำหรับเหตุการณ์ไอเท็มที่บันทึกไว้')
            entry = dict(kind='town_chest',stage=stage,mapId=town,context='town',name=name,tileX=x,tileY=y,image=image,fullImage=terrain['image'],width=w,height=h,
                         pin=dict(x=(px-x0)/w,y=(py-y0)/h),action=action,source=dict(objectSlotHex='0E',coordinateFileOffset=f'0x{offset:06X}',consumer=consumer,acquisitionCpu=acquisition_cpu))
            entry['requiresKey'] = bool(chest.get('requiresKey'))
            if reward_item:
                entry['rewardItem'] = reward_item
                composite_key = f"{reward_item['category']}:{reward_item['id']}"
                acquisition_items.setdefault(composite_key, []).append(entry)
            if required_item:
                entry['requiredItem'] = required_item
            elif chest.get('requiresKey') is False:
                entry['requiresKey'] = False
            if chest.get('capacityCheck'):
                entry['capacityCheck'] = chest['capacityCheck']
            if quest['items'].get('17',{}).get('rawTrace',{}).get('keyConsumed') is False and required_item:
                entry['keyConsumed'] = False
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
                save_crop_if_changed(outside.crop((ox,oy,ox+ew,oy+eh)), ROOT/'catalogue'/approach_image)
                entry['approach']=dict(image=approach_image,fullImage='maps/'+field['image'],width=ew,height=eh,tileX=ex,tileY=ey,pin=dict(x=(epX-ox)/ew,y=(epY-oy)/eh))
            for item in ids:
                if item in ['0F','12']: result.setdefault(item,[]).insert(0,entry)
                else: result.setdefault(item,[]).append(entry)
        # Verify the keyless item grants directly against the original LoROM bytes.
        # These handlers compare the internal map ID and write the reward ID to the
        # item-grant slot before continuing the town-chest event.
        for cpu, expected in [
            ('00:D0EA', bytes.fromhex('C9 09 00 D0 27 A9 0F 00 8D 94 12')),
            ('00:D158', bytes.fromhex('C9 0B 00 D0 27 A9 11 00 8D 94 12')),
        ]:
            if r[cpu_offset(cpu):cpu_offset(cpu)+len(expected)] != expected:
                raise ValueError(f'Keyless chest reward signature mismatch at {cpu}')
        locked_handler = r[cpu_offset('00:CFB1'):cpu_offset('00:D059')]
        for map_id in (7, 8, 10, 12):
            branch = bytes((0xC9, map_id, 0x00, 0xD0, 0x1A, 0xA9, 0x17, 0x00, 0x8D, 0x94, 0x12))
            if branch not in locked_handler:
                raise ValueError(f'Locked chest map/key branch mismatch for town map {map_id}')
        acquisition_output = dict(
            schemaVersion=1,
            rom=dict(sha1=SHA1),
            scope='Town-chest item acquisition locations keyed by category:id. Locations and rewards are read from the original Japanese ROM trace; town and paired outdoor images are rendered from the same ROM.',
            coordinateNote='Town chest coordinates are X,Y tiles from the ROM object-coordinate table. townEntranceOrdinal identifies the paired room entrance by its arrival row; approach marks that outdoor entrance but does not claim a walked route from it to the chest.',
            items=acquisition_items,
        )
        (ROOT/'data/town-item-acquisition.json').write_text(json.dumps(acquisition_output,ensure_ascii=False,indent=2)+'\n')
    output = dict(schemaVersion=1,rom=dict(sha1=SHA1),scope='NPC default positions from original-ROM object tables; item-use bindings from traced event consumers. Fireworks activation rectangle comes from 03:C63A..C65E. Terrain is rendered from the same original ROM.',items=result)
    (ROOT/'data/tool-use-locations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(points)} outdoor plus available town-chest tool/event locations for {len(result)} items')
if __name__ == '__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);a=p.parse_args();build(a.rom)
