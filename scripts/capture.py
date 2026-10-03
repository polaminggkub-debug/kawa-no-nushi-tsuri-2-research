#!/usr/bin/env python3
"""Minimal libretro capture frontend used in this research.

Requires numpy/Pillow and a separately obtained compatible Snes9x libretro core.
Screenshots are genuine emulator output. Writes affect only temporary WRAM;
the supplied ROM is read-only. State and memory dumps remain local.
"""
import ctypes as C, json, sys, argparse, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
parser=argparse.ArgumentParser(description='Capture a user-supplied original ROM with a user-supplied Snes9x libretro core. ROM/core/state files are not distributed.')
parser.add_argument('--rom',type=Path,required=True)
parser.add_argument('--core',type=Path,required=True)
parser.add_argument('--request',type=Path,required=True)
parser.add_argument('--state',type=Path)
parser.add_argument('--output-dir',type=Path,default=Path('local-run'))
args=parser.parse_args()
rom=args.rom.resolve()
rom_bytes=rom.read_bytes()
SUPPORTED_DUMPS={('c2103dd94e2a1a65a495fc02adc2e7d040f31212',1572864):'Japanese original',('453047280f53ab9faf93142b957967c1eec69afc',2097152):'Thai V1.2'}
if (hashlib.sha1(rom_bytes).hexdigest(),len(rom_bytes)) not in SUPPORTED_DUMPS:
 parser.error('Unsupported ROM: use the matching Japanese original or Thai V1.2 dump supplied by you.')
HERE=args.output_dir.resolve();HERE.mkdir(parents=True,exist_ok=True)
ROOT=HERE
req=json.loads(args.request.read_text(encoding='utf-8'))
state=args.state.resolve() if args.state else HERE/'capture.state'
if state.suffix!='.state':parser.error('--state must have the .state extension')
def output_path(name):
 path=(ROOT/name).resolve()
 if not path.is_relative_to(ROOT):raise ValueError('Capture images must stay inside --output-dir')
 if path.suffix.lower()!='.png':raise ValueError('Capture image names must end in .png')
 path.parent.mkdir(parents=True,exist_ok=True)
 return path
class Game(C.Structure):
 _fields_=[('path',C.c_char_p),('data',C.c_void_p),('size',C.c_size_t),('meta',C.c_char_p)]
ENV=C.CFUNCTYPE(C.c_bool,C.c_uint,C.c_void_p)
VIDEO=C.CFUNCTYPE(None,C.c_void_p,C.c_uint,C.c_uint,C.c_size_t)
AUDIO=C.CFUNCTYPE(None,C.c_int16,C.c_int16)
BATCH=C.CFUNCTYPE(C.c_size_t,C.c_void_p,C.c_size_t)
POLL=C.CFUNCTYPE(None)
INPUT=C.CFUNCTYPE(C.c_int16,C.c_uint,C.c_uint,C.c_uint,C.c_uint)
buttons=set(); pixel=0; latest=None; directory=str(HERE).encode()
@ENV
def environment(cmd,data):
 global pixel
 if cmd==10:pixel=C.cast(data,C.POINTER(C.c_int))[0];return True
 if cmd in (9,30,31):C.cast(data,C.POINTER(C.c_char_p))[0]=directory;return True
 if cmd==17:C.cast(data,C.POINTER(C.c_bool))[0]=False;return True
 if cmd==3:C.cast(data,C.POINTER(C.c_bool))[0]=False;return True
 if cmd==39:C.cast(data,C.POINTER(C.c_uint))[0]=0;return True
 if cmd in (11,16,18,35,37):return True
 return False
@VIDEO
def video(data,w,h,pitch):
 global latest
 if not data:return
 raw=C.string_at(data,pitch*h)
 if pixel==1:
  a=np.frombuffer(raw,dtype=np.uint8).reshape(h,pitch)[:,:w*4].reshape(h,w,4)
  latest=Image.fromarray(a[:,:,[2,1,0]])
 else:
  a=np.frombuffer(raw,dtype='<u2').reshape(h,pitch//2)[:,:w]
  if pixel==2:r=((a>>11)&31)*255//31;g=((a>>5)&63)*255//63;b=(a&31)*255//31
  else:r=((a>>10)&31)*255//31;g=((a>>5)&31)*255//31;b=(a&31)*255//31
  latest=Image.fromarray(np.stack([r,g,b],axis=2).astype(np.uint8))
@AUDIO
def audio(l,r):pass
@BATCH
def batch(data,frames):return frames
@POLL
def poll():pass
@INPUT
def inp(port,device,index,key):return int(key in buttons) if port==0 else 0
core=C.CDLL(str(args.core.resolve()))
for name,cb in [('environment',environment),('video_refresh',video),('audio_sample',audio),('audio_sample_batch',batch),('input_poll',poll),('input_state',inp)]:
 getattr(core,'retro_set_'+name)(cb)
core.retro_init()
core.retro_load_game.argtypes=[C.POINTER(Game)];core.retro_load_game.restype=C.c_bool
core.retro_get_memory_data.argtypes=[C.c_uint];core.retro_get_memory_data.restype=C.c_void_p
core.retro_get_memory_size.argtypes=[C.c_uint];core.retro_get_memory_size.restype=C.c_size_t
core.retro_serialize_size.restype=C.c_size_t
core.retro_serialize.argtypes=[C.c_void_p,C.c_size_t];core.retro_serialize.restype=C.c_bool
core.retro_unserialize.argtypes=[C.c_void_p,C.c_size_t];core.retro_unserialize.restype=C.c_bool
rombuf=C.create_string_buffer(rom.read_bytes());game=Game(str(rom).encode(),C.cast(rombuf,C.c_void_p),rom.stat().st_size,None)
assert core.retro_load_game(C.byref(game))
core.retro_set_controller_port_device(0,1)
if state.exists() and not req.get('reset'):
 buf=C.create_string_buffer(state.read_bytes());assert core.retro_unserialize(buf,len(buf)-1)
ram_ptr=core.retro_get_memory_data(2);ram_len=core.retro_get_memory_size(2)
ram=(C.c_ubyte*ram_len).from_address(ram_ptr)
for step in req.get('steps',[]):
 for address,value in step.get('write',[]):
  vals=value if isinstance(value,list) else [value]
  for j,v in enumerate(vals):ram[int(str(address),0)+j]=v
 buttons=set(step.get('buttons',[]))
 for i in range(step.get('frames',1)):core.retro_run()
 if step.get('image') and latest:latest.save(output_path(step['image']))
buttons=set();core.retro_run()
size=core.retro_serialize_size();buf=C.create_string_buffer(size);assert core.retro_serialize(buf,size);state.write_bytes(buf.raw)
(HERE/'wram.bin').write_bytes(bytes(ram))
if req.get('image') and latest:latest.save(output_path(req['image']))
print(json.dumps({'core_sha256':hashlib.sha256(args.core.read_bytes()).hexdigest(),'rom_sha256':hashlib.sha256(rom_bytes).hexdigest(),'state':str(state),'ram_bytes':ram_len,'pixel_format':pixel,'size':latest.size if latest else None}))
core.retro_unload_game();core.retro_deinit()
