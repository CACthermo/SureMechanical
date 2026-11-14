"""Create small transparent RTU views from the client's supplied roofunit01.obj.

Run with Blender 4.3+: blender -b -P scripts/render-rtu-hologram.py
These are pre-rendered visual assets; no runtime WebGL required.
"""
import bpy
import math
import subprocess
import tempfile
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'public' / 'models' / 'roofunit01.obj'
DEST = ROOT / 'public' / 'models'

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath=str(SOURCE))
objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
assert objects, 'No geometry found in rooftop unit OBJ'

for item in objects:
    item.select_set(True)
bpy.context.view_layer.objects.active = objects[0]
if len(objects) > 1:
    bpy.ops.object.join()
mesh = bpy.context.view_layer.objects.active
print('MODEL:', mesh.name, 'vertices:', len(mesh.data.vertices), 'bounds:', tuple(mesh.dimensions))

# Normalize original model coordinates: its vertical axis is Y.
mesh.rotation_euler = (math.pi / 2, 0, 0)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.context.view_layer.update()
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
mesh.location = (0, 0, 0)
size = max(mesh.dimensions)
mesh.scale = (4.1 / size,) * 3
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
print('NORMALIZED:', tuple(mesh.location), tuple(mesh.dimensions), 'hide:', mesh.hide_render)

shell = bpy.data.materials.new('Holographic brushed steel')
shell.diffuse_color = (0.05, 0.55, 0.69, 1)
shell.use_nodes = True
bsdf = shell.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value = (0.025, 0.29, 0.39, 1)
bsdf.inputs['Metallic'].default_value = 0.42
bsdf.inputs['Roughness'].default_value = 0.31
bsdf.inputs['Emission Color'].default_value = (0.02, 0.38, 0.6, 1)
bsdf.inputs['Emission Strength'].default_value = 0.35
mesh.data.materials.clear()
mesh.data.materials.append(shell)

wire = mesh.copy()
wire.data = mesh.data.copy()
bpy.context.collection.objects.link(wire)
outline = wire.modifiers.new('Edge tracery', 'WIREFRAME')
outline.thickness = 0.007
outline.use_replace = True
glow = bpy.data.materials.new('Cyan engineering edge')
glow.use_nodes = True
gbsdf = glow.node_tree.nodes.get('Principled BSDF')
gbsdf.inputs['Base Color'].default_value = (0.07, 0.85, 1.0, 1)
gbsdf.inputs['Emission Color'].default_value = (0.03, 0.75, 1.0, 1)
gbsdf.inputs['Emission Strength'].default_value = 1.7
wire.data.materials.clear()
wire.data.materials.append(glow)

def area(name, loc, energy, color, size):
    bpy.ops.object.light_add(type='AREA', location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.data.energy = energy
    ob.data.color = color
    ob.data.shape = 'DISK'
    ob.data.size = size
    ob.rotation_euler = (Vector((0, 0, 0)) - ob.location).to_track_quat('-Z', 'Y').to_euler()

area('Soft white fill', (2, -4, 8), 720, (0.8, 0.98, 1.0), 7)
area('Cyan edge fill', (-6, 3, 6), 550, (0.04, 0.65, 1.0), 6)

bpy.ops.object.camera_add()
camera = bpy.context.object
bpy.context.scene.camera = camera
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 6.8

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.eevee.taa_render_samples = 8
scene.render.resolution_x = 800
scene.render.resolution_y = 530
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True
scene.view_settings.view_transform = 'Standard'

views = [
    ('rtu-topdown.png', (0, 0, 12.0)),
    ('rtu-transition.png', (5.5, -7, 10)),
    ('rtu-isometric.png', (8.0, -10, 7.3)),
]
with tempfile.TemporaryDirectory(prefix='sure-rtu-') as temp_dir:
    for filename, loc in views:
        camera.location = loc
        camera.rotation_euler = (0, 0, 0) if filename == 'rtu-topdown.png' else (-camera.location).to_track_quat('-Z', 'Y').to_euler()
        png = Path(temp_dir) / filename
        scene.render.filepath = str(png)
        bpy.ops.render.render(write_still=True)
        subprocess.run(['magick', str(png), '-quality', '86', str(DEST / filename.replace('.png', '.webp'))], check=True)
