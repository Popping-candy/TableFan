extends MeshInstance

var rotation_speed = 0		# 初始角速度
var target_speed = 12		# 目标角速度
var target = [9,12,15]		# 目标角速度 9,12,15
var acceleration = 5		# 加速度
var is_rotating = 0			# 是否正在旋转	 0,1,2,3

func _ready():
	var fan=get_node("..")
	fan.connect("rotat_changed",self,"on_rotat_changed")

func _process(delta):
	if is_rotating:
		if rotation_speed < target_speed:
			rotation_speed += acceleration * delta  # 加速度增加角速度
		if rotation_speed > target_speed:
				rotation_speed = target_speed
	else:
		rotation_speed -= acceleration * delta  # 减速度减少角速度
		if rotation_speed < 0:
			rotation_speed = 0
	rotate_object(delta)  # 调用旋转物体的函数

func rotate_object(delta):
	var rotation_angle = rotation_speed * delta
	rotate(Vector3(0, 0, 1), rotation_angle)  # 绕z轴旋转物体

func on_rotat_changed(btn_id):
	is_rotating = btn_id
	if btn_id:
		target_speed = target[btn_id-1]
