#!/usr/bin/env python3
"""Extract shop stock from the six compressed field blocks in the original ROM.
Compression follows 00:E5C2..E6E2, shop consumers at 03:879E..9270.
No ROM or emulator state is written to the output.
"""
import argparse,hashlib,json
from pathlib import Path
SHA1='c2103dd94e2a1a65a495fc02adc2e7d040f31212'
def word(b,p):return int.from_bytes(b[p:p+2],'little')
def decompress(r,p):
 size=word(r,p);p+=2;out=bytearray();flags=bits=0
 while len(out)<size:
  if not bits:flags=r[p];p+=1;bits=8
  literal=flags&1;flags>>=1;bits-=1
  if literal:out.append(r[p]);p+=1
  else:
   low,high=r[p:p+2];p+=2
   ring=(high>>4)*256+low;length=(high&15)+3
   source=len(out)-((len(out)-ring)&4095)
   for n in range(length):out.append(out[source+n] if source+n>=0 else 0)
 if len(out)!=size:raise ValueError('Invalid decompressed length')
 return out
SECTIONS=[('rod',0x6b85,8),('lure',0x6b95,24),('hook',0x6bc5,4),('float_weight',0x6bcd,6),('bait',0x6bd9,11),('fly',0x6bef,8),('fly_wing',0x6bff,8),('fly_tail',0x6c0f,8),('mixed_tool_food',0x6c1f,8)]
def fly_bundle(r,block,slot):
 body=word(block,0x4bef+slot*2);wing=word(block,0x4bff+slot*2);tail=word(block,0x4c0f+slot*2)
 if not body:return None
 base=0x28000+(word(r,0x2800c)-0x8000)+(body-1)*11
 return {'slot':slot,'body':f'{body:02X}','wing':f'{wing:02X}','tail':f'{tail:02X}','shopPriceYen':word(r,base+9)}
def extract(r):
 if hashlib.sha1(r).hexdigest()!=SHA1:raise ValueError('Requires matching headerless Japanese ROM')
 areas=[];byitem={}
 for stage in range(1,7):
  q=0x74a+stage*8;cpu=word(r,q);bank=word(r,q+2);offset=(bank&127)*32768+(cpu&32767);block=decompress(r,offset);rows=[]
  for category,address,count in SECTIONS:
   for slot in range(count):
    raw=word(block,address-0x2000+slot*2)
    if not raw:continue
    cat=('food' if raw&0x8000 else 'general_tool') if category=='mixed_tool_food' else category
    item=raw&0x7fff;key=f'{cat}:{item:02X}'
    row={'category':cat,'id':f'{item:02X}','stockWord':raw,'section':category,'slot':slot,'decompressedOffset':hex(address-0x2000+slot*2)}
    if cat=='bait' and item==0x17:row['condition']='sell at least one Ayu before buying; each purchase subtracts 9 from sold-Ayu counter, floored at 0'
    rows.append(row);byitem.setdefault(key,[]).append({'stage':stage,**({'shop':'fly_bundle','bundle':fly_bundle(r,block,slot)} if cat.startswith('fly') else {}),**({'condition':row['condition']} if 'condition'in row else {})})
  for item in {4:[0x0D],5:[0x08,0x01],6:[0x10]}.get(stage,[]):
   row={'category':'rod','id':f'{item:02X}','section':'special_rod_shop','source':'03:86E1..8733'}
   rows.append(row);byitem.setdefault(f'rod:{item:02X}',[]).append({'stage':stage,'shop':'special_rod_shop'})
  bundles=[fly_bundle(r,block,slot) for slot in range(8) if word(block,0x4bef+slot*2)]
  areas.append({'stage':stage,'compressedFileOffset':hex(offset),'decompressedSize':len(block),'items':rows,'flyBundles':bundles})
 return {'schemaVersion':1,'romSha1':SHA1,'method':'Original-ROM field-block decompression and traced shop menu copies; no external guide','sources':['docs/shop-stock-research.md'],'areas':areas,'items':byitem}
def main():
 a=argparse.ArgumentParser(description=__doc__);a.add_argument('--rom',type=Path,required=True);a.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'data/shop-stock-rom.json');v=a.parse_args();v.output.write_text(json.dumps(extract(v.rom.read_bytes()),ensure_ascii=False,indent=2)+'\n');print(v.output)
if __name__=='__main__':main()
