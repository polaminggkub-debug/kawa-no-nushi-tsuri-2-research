#!/usr/bin/env python3
"""Extract the original ROM's selected-tool dispatch and its source index.

This is an evidence index, not a simulation of complete item effects. Semantic
traces and event consumers are documented separately. No ROM is modified.
"""
import argparse, hashlib, json
from pathlib import Path
SHA1='c2103dd94e2a1a65a495fc02adc2e7d040f31212'
def offset(bank,address):return (bank&127)*0x8000+(address&0x7fff)
def word(r,p):return int.from_bytes(r[p:p+2],'little')
def extract(r):
 if len(r)!=1572864 or hashlib.sha1(r).hexdigest()!=SHA1:raise ValueError('Requires the matching headerless Japanese original ROM')
 start,end=offset(3,0xBC4A),offset(3,0xBD2F)
 items={}
 for n in range(1,24):
  p=offset(5,0xB258)+(n-1)*6
  items[f'{n:02X}']={'id':f'{n:02X}','recordFileOffset':f'0x{p:06X}','recordBytes':r[p:p+6].hex(' '),'basePriceYen':word(r,p+4),'selectedUseHandler':None}
 for p in range(start,end-7):
  if r[p]==0xC9 and r[p+2:p+6]==bytes.fromhex('00 d0 06 20'):
   n=r[p+1]
   if f'{n:02X}' in items:
    items[f'{n:02X}']['selectedUseHandler']={'cpuAddress':f'03:{word(r,p+6):04X}','dispatchCpuAddress':f'03:{0x8000+p%0x8000:04X}','dispatchBytes':r[p:p+8].hex(' ')}
 gate=offset(3,0xBCA6)
 if r[gate:gate+13]!=bytes.fromhex('c9 0a 00 f0 02 b0 06 20 4a c2 4c 2e bd'):raise ValueError('Unexpected shared groundbait branch')
 for n in [8,9,10]:items[f'{n:02X}']['selectedUseHandler']={'cpuAddress':'03:C24A','dispatchCpuAddress':'03:BCA6','dispatchBytes':r[gate:gate+13].hex(' '),'note':'After IDs01..07 have been excluded, the <=0A branch covers08,09,0A.'}
 items['17']['selectedUseHandler']={'cpuAddress':'03:BD1B','dispatchCpuAddress':'03:BD16','note':'Inline message-only key selection branch; chest interaction is a separate consumer.'}
 for n in [11,12,13]:items[f'{n:02X}']['note']='No explicit selected-use branch in this dispatcher. Capacity consumers are separate.'
 return {'schemaVersion':1,'rom':{'sha1':SHA1,'sizeBytes':len(r)},'dispatcher':{'cpuAddress':'03:BC4A..BD2E','selectedSlotIndex':'7E:1BCF','selectedIdArray':'7E:1BD5','selectedIdWord':'7E:1294'},'scope':'Source index of selected-use dispatch. This does not replace each item\u2019s effect, event, and capacity traces.','items':items}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();result=extract(a.rom.read_bytes());a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
