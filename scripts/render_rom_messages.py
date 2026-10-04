#!/usr/bin/env python3
"""Render message glyphs directly from the original ROM's font.

Static message previews only. Runtime substitutions are shown as labels.
Font addressing is traced at 02:89D9/89FD; text pointers at 00:D9D8/D9F3.
"""
import argparse, hashlib
from pathlib import Path
from PIL import Image, ImageDraw
SHA1='c2103dd94e2a1a65a495fc02adc2e7d040f31212'
def word(r,p):return int.from_bytes(r[p:p+2],'little')
def glyph(r,code,kanji=False):
 i=code if kanji else code-1
 p=0x30000+(0 if kanji else 0x5800)+(i&7)*16+(i&0xff8)*32
 im=Image.new('RGB',(16,16),'white')
 for y in range(16):
  for half in range(2):
   b=r[p+(y//8)*128+half*8+y%8]
   for x in range(8):
    if b&(128>>x):im.putpixel((half*8+x,y),(0,0,0))
 return im

def render(r,indices):
 table=0x20000+word(r,0x28016)
 rows=[]
 for index in indices:
  ptr=0x20000+word(r,table+index);cur=ptr
  lines=[[]]
  while cur<len(r) and cur-ptr<2048:
   b=r[cur];cur+=1
   if b==0:break
   if b>=0xe0:
    n=((b&15)<<8)|r[cur];cur+=1;lines[-1].append(glyph(r,n,True))
   elif b<0xcc:lines[-1].append(glyph(r,b))
   elif b==0xcc:lines.append([])
   else:
    im=Image.new('RGB',(64,16),'#e6efed');ImageDraw.Draw(im).text((0,2),f'[{b:02X}]',fill='black');lines[-1].append(im)
   if sum(im.width for im in lines[-1])>=384:lines.append([])
  im=Image.new('RGB',(800,36+len(lines)*36),'white');d=ImageDraw.Draw(im)
  d.text((4,4),f'Message table offset ${index:04X} / file 0x{ptr:06X}',fill='black')
  for y,line in enumerate(lines):
   x=4
   for g in line:im.paste(g.resize((g.width*2,32),Image.Resampling.NEAREST),(x,28+y*36));x+=g.width*2
  rows.append(im)
 out=Image.new('RGB',(800,sum(x.height for x in rows)),'#ddd');y=0
 for im in rows:out.paste(im,(0,y));y+=im.height
 return out

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--rom',type=Path,required=True);p.add_argument('--messages',required=True,help='Comma-separated hexadecimal byte offsets in the message pointer table');p.add_argument('--output',type=Path,required=True);a=p.parse_args();r=a.rom.read_bytes()
 if hashlib.sha1(r).hexdigest()!=SHA1:raise ValueError('Requires the matching original Japanese ROM')
 render(r,[int(x,16) for x in a.messages.split(',')]).save(a.output)
if __name__=='__main__':main()
