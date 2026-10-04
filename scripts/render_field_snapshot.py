#!/usr/bin/env python3
"""Render mode-1 terrain from a locally generated Snes9x SNAP state.

No state, ROM, VRAM or WRAM dump is distributed. The output omits sprites.
Requires Pillow. This reads the emulator's saved tile maps, tile graphics,
palette and main/subscreen registers; it does not invent terrain artwork.
"""
from pathlib import Path
from PIL import Image
import argparse

def read_chunks(data):
    if not data.startswith(b'#!s9xsnp:'):raise ValueError('Expected an uncompressed Snes9x SNAP state')
    i=data.index(b'\n')+1;result={}
    while i<len(data):
        tag=data[i:i+3].decode('ascii');length=int(data[i+4:i+10]);result[tag]=data[i+11:i+11+length];i+=11+length
    return result

def render(data, height=224, scanline_offset=1):
    chunks=read_chunks(data);v=chunks['VRA'];p=chunks['PPU'];f=chunks['FIL'];ram=chunks['RAM']
    if p[58]!=1:raise ValueError('Only the game field in SNES mode 1 is supported')
    palette=[]
    for k in range(256):
        c=int.from_bytes(p[64+2*k:66+2*k],'big');g=(c>>5)&31
        palette.append(((c&31)*255//31,((g<<1)|(g>>4))*255//63,((c>>10)&31)*255//31))
    tile_cache={}
    def tile(n,base,pa,bpp):
        key=(n,base,pa,bpp)
        if key in tile_cache:return tile_cache[key]
        a=[v[(base+n*8*bpp+j)%65536] for j in range(8*bpp)];im=Image.new('RGBA',(8,8))
        for y in range(8):
            for x in range(8):
                c=sum(((a[2*y+(z&1)+(z//2)*16]>>(7-x))&1)<<z for z in range(bpp))
                if c:im.putpixel((x,y),palette[pa*(1<<bpp)+c]+(255,))
        tile_cache[key]=im;return im
    layers={};scroll={}
    for bg in range(3):
        off=14+bg*11;sc=int.from_bytes(p[off:off+2],'big')*2;ch=int.from_bytes(p[off+7:off+9],'big')*2;size=int.from_bytes(p[off+9:off+11],'big')
        if p[off+6]:raise ValueError('16px hardware BG tiles are not supported')
        width=64 if size&1 else 32;map_height=64 if size&2 else 32
        scroll[bg]=(int.from_bytes(p[off+2:off+4],'big'),int.from_bytes(p[off+4:off+6],'big'))
        for priority in [0,1]:layers[bg,priority]=Image.new('RGBA',(width*8,map_height*8))
        for y in range(map_height):
            for x in range(width):
                page=x//32+(y//32)*(2 if size&1 else 1);addr=(sc+page*2048+((y%32)*32+x%32)*2)%65536;word=int.from_bytes(v[addr:addr+2],'little')
                im=tile(word&1023,ch,(word>>10)&7,2 if bg==2 else 4)
                if word&0x4000:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                if word&0x8000:im=im.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
                layers[bg,(word>>13)&1].paste(im,(x*8,y*8))
    main=Image.new('RGB',(256,height),palette[0]);sub=main.copy();winner=[[5]*256 for _ in range(height)]
    order=[(2,0),(1,0),(0,0),(1,1),(0,1),(2,1)]
    for target,flags in [(main,f[0x212c]),(sub,f[0x212d])]:
        for bg,priority in order:
            if not flags&(1<<bg):continue
            im=layers[bg,priority];sx,sy=scroll[bg]
            for y in range(height):
                for x in range(256):
                    c=im.getpixel(((x+sx)%im.width,(y+sy+scanline_offset)%im.height))
                    if c[3]:
                        target.putpixel((x,y),c[:3])
                        if target is main:winner[y][x]=bg
    for y in range(height):
        for x in range(256):
            if f[0x2131]&(1<<winner[y][x]):
                a=main.getpixel((x,y));b=sub.getpixel((x,y));subtract=bool(f[0x2131]&128);half=bool(f[0x2131]&64)
                main.putpixel((x,y),tuple(max(0,min(255,(a[k]-b[k] if subtract else a[k]+b[k])//(2 if half else 1))) for k in range(3)))
    return main,{'cameraX':int.from_bytes(ram[0x0838:0x083a],'little'),'cameraY':int.from_bytes(ram[0x083a:0x083c],'little')}

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('state',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    image,meta=render(args.state.read_bytes());args.output.parent.mkdir(parents=True,exist_ok=True);image.save(args.output);print(meta)
if __name__=='__main__':main()
