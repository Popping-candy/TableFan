extends MeshInstance

var rotation_speed = 0  # 初始角速度
var target_speed = 12  # 目标角速度	9,12,15
var acceleration = 5  # 加速度
var deceleration = 5  # 减速度

var is_in = 0
var is_on = 0
var is_rotating = 0  # 是否正在旋转	0,1,2,3

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if is_rotating:
		if rotation_speed < target_speed:
			rotation_speed += acceleration * delta  # 加速度增加角速度
		if rotation_speed > target_speed:
				rotation_speed = target_speed
	else:
		rotation_speed -= deceleration * delta  # 减速度减少角速度
		if rotation_speed < 0:
			rotation_speed = 0
	rotate_object(delta)  # 调用旋转物体的函数


func rotate_object(delta):
	var rotation_angle = rotation_speed * delta
	rotate(Vector3(0, 0, 1), rotation_angle)  # 绕z轴旋转物体

func _input(event):
	if event is InputEventMouseButton:
		if event.button_index == BUTTON_LEFT and event.pressed:
			if is_on == 1:

				print("fan turns on")
				$play_up.play()
				is_rotating = 1
			elif is_in == 1:
				print("fan turns off")
				is_rotating = 0
				$play_down.play()
func _on_button_off_mouse_entered():
	is_in = 1
func _on_button_off_mouse_exited():
	is_in = 0
func _on_button_1_mouse_entered():
	is_on = 1
func _on_button_1_mouse_exited():
	is_on = 0
func _on_button_2_mouse_entered():
	is_on = 1
func _on_button_2_mouse_exited():
	is_on = 0
func _on_button_3_mouse_entered():
	is_on = 1
func _on_button_3_mouse_exited():
	is_on = 0
