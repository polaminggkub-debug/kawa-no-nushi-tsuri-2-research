#!/usr/bin/env python3
"""Join ROM spawn slots with ROM-rendered maps; never read community map data."""
import json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
CAT=ROOT/'catalogue'
RAW=ROOT/'data/rom-fish-locations.json'
MANIFEST=CAT/'maps/rom-map-manifest.json'
def loc(en,ja,th):return {'en':en,'ja':ja,'th':th}
def build():
    data=json.loads(RAW.read_text())
    art=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    maps=art.get('maps',art.get('mapSets',{}))
    if isinstance(maps,list):maps={str(m.get('mapSet',m.get('stage'))).zfill(2):m for m in maps}
    maps={str(key).removeprefix('mapSet').zfill(2):value for key,value in maps.items()}
    result={}
    for fish_id,fish in data['fish'].items():
        locations=[]
        for row in fish['locations']:
            map_id=row['mapSet'];stage=int(map_id);m=maps.get(map_id,{})
            grouped={}
            for point in row['points']:
                grouped.setdefault((point['x'],point['y']),[]).append(point['index'])
            points=[{'x':xy[0],'y':xy[1],'slotIndices':indices} for xy,indices in sorted(grouped.items(),key=lambda kv:(kv[0][1],kv[0][0]))]
            assets=[];overview=None
            field=m.get('fieldMap',{})
            src=field.get('image') or m.get('fieldImage') or (m.get('image') if m.get('projection') else None)
            if src and '/' not in src:src='maps/'+src
            if src:
                path=CAT/src
                if path.exists():
                    image=Image.open(path).convert('RGB');width,height=image.size
                    rotated=height>width
                    overview_name=f'maps/rom-field-{map_id}-overview.png'
                    overview_image=image.transpose(Image.Transpose.ROTATE_90) if rotated else image
                    overview_image.save(CAT/overview_name)
                    overview={'image':overview_name,'width':overview_image.width,'height':overview_image.height,'rotated':rotated}
                    origin_x=m.get('originX',0);origin_y=m.get('originY',0)
                    projection=field.get('worldToMapPixel') or m.get('projection')
                    if not projection:raise ValueError(f'Map {map_id} needs a verified tile-to-image projection')
                    scale_x=projection['scaleX'];scale_y=projection['scaleY'];offset_x=projection['offsetX'];offset_y=projection['offsetY']
                    chunk_size=384;chunks={}
                    for point in points:
                        px=point['x']*scale_x+offset_x;py=point['y']*scale_y+offset_y
                        if not(0<=px<width and 0<=py<height):raise ValueError(f'Point outside ROM map: {map_id} {point}')
                        chunks.setdefault((int(px)//chunk_size,int(py)//chunk_size),[]).append((point,px,py))
                    for (cx,cy),placed in sorted(chunks.items(),key=lambda kv:(kv[0][1],kv[0][0])):
                        # Keep nearby terrain around this group and leave room above pins.
                        x0=max(0,int(min(px for point,px,py in placed))-80)
                        y0=max(0,int(min(py for point,px,py in placed))-80)
                        x1=min(width,int(max(px for point,px,py in placed))+81)
                        y1=min(height,int(max(py for point,px,py in placed))+81)
                        name=f'maps/map-{map_id}-fish-{fish_id}-part-{cx+1}-{cy+1}.png';target=CAT/name;target.parent.mkdir(exist_ok=True,parents=True)
                        image.crop((x0,y0,x1,y1)).save(target)
                        assets.append({'image':name,'fullImage':src,'name':loc(f'Map {stage} · column {cx+1}, row {cy+1}',f'地図{stage} · 列{cx+1}・行{cy+1}',f'แผนที่ {stage} · ส่วนคอลัมน์ {cx+1} แถว {cy+1}'),'width':x1-x0,'height':y1-y0,'overviewBox':({'x':y0/height,'y':(width-x1)/width,'width':(y1-y0)/height,'height':(x1-x0)/width} if rotated else {'x':x0/width,'y':y0/height,'width':(x1-x0)/width,'height':(y1-y0)/height}),'tileBounds':{'xMin':min(point['x'] for point,px,py in placed),'xMax':max(point['x'] for point,px,py in placed),'yMin':min(point['y'] for point,px,py in placed),'yMax':max(point['y'] for point,px,py in placed)},'pins':[{'x':(px-x0)/(x1-x0),'y':(py-y0)/(y1-y0),'tileX':point['x'],'tileY':point['y'],'slotIndices':point['slotIndices']} for point,px,py in placed]})
            count=len(points);slots=len(row['points'])
            locations.append({'stage':stage,'mapSet':map_id,'stageName':m.get('name') or loc(f'ROM map {stage}',f'ROM地図{stage}',f'แผนที่ ROM {stage}'),'description':loc(f'The game configures {count} distinct fishing points for this fish here ({slots} spawn slots). Some slots can be inactive in a generated state.',f'この魚に{count}か所（{slots}出現枠）が設定されている。生成状態によって無効な枠がある。',f'เกมกำหนดจุดของปลาชนิดนี้ไว้ {count} ตำแหน่ง ({slots} ช่องเกิดปลา) บางช่องอาจไม่ทำงานในรอบที่เกมสร้างปลา'),'points':points,'maps':assets,'overview':overview,'evidence':{'type':'rom_spawn_tables','sources':['data/rom-fish-locations.json','docs/fish-location-research.md','catalogue/maps/rom-map-manifest.json']}})
        result[fish_id]={'nameJa':fish['nameJa'],'locations':locations}
    output={'schemaVersion':1,'rom':data['rom'],'scope':loc('Only ROM spawn tables and maps rendered from the same supplied ROM. No community map placements.','同じ提供ROMの出現表と描画地図だけを使用。外部攻略マップの位置は使用しない。','ใช้เฉพาะตารางจุดเกิดและภาพแผนที่ที่ถอดจาก ROM เดียวกัน ไม่ใช้ตำแหน่งจากไกด์'),'fish':result}
    (CAT/'fish-locations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(result)} ROM fish location records; {sum(bool(l["maps"]) for f in result.values() for l in f["locations"])} mapped fish/area pairs')
if __name__=='__main__':build()
