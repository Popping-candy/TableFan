extends Spatial

signal rotat_changed(level)
var btn_id = -1
var url = "http://192.168.179.133:8000/fans"
var headers = [
	"Content-Type: application/json",
	"Accept: application/json",
	"api-version: 0.1"
	]

func _ready():
	$pCube3/button_off.connect("mouse_entered",self,"on_mouse_located",[0])
	$pCube4/button_1.connect("mouse_entered",self,"on_mouse_located",[1])
	$pCube5/button_2.connect("mouse_entered",self,"on_mouse_located",[2])
	$pCube6/button_3.connect("mouse_entered",self,"on_mouse_located",[3])
	$HTTPRequest.connect("request_completed",self,"on_request_completed")
	$pCube3/button_off.connect("mouse_exited",self,"on_mouse_exited")
	$pCube4/button_1.connect("mouse_exited",self,"on_mouse_exited")
	$pCube5/button_2.connect("mouse_exited",self,"on_mouse_exited")
	$pCube6/button_3.connect("mouse_exited",self,"on_mouse_exited")
func on_mouse_located(id):
	btn_id = id
func on_mouse_exited():
	btn_id = -1

func _input(event):
	if event is InputEventMouseButton:
		if event.button_index == BUTTON_LEFT and event.pressed and btn_id != -1:
			print("mouse_pressed: ",btn_id)
			emit_signal("rotat_changed",btn_id)
			if btn_id:
				$play_up.play()
			else:
				$play_down.play()
			SendDeploymentReq()

func SendDeploymentReq():
	var file = File.new()
	var json_str
	var json_data = {}
	if file.open("res://json/order.json", File.READ) == OK:
		json_str = file.get_as_text()
		json_data = JSON.parse(json_str).result
		file.close()
	else:
		print("无法打开文件")
	var effect_data = json_data["order"][btn_id]
	var updated_json_str = JSON.print(effect_data)
	print(updated_json_str)
	$HTTPRequest.request(url, headers, true, HTTPClient.METHOD_GET, updated_json_str)

func on_request_completed(result, response_code, headers, body):
	print(response_code)
	var output = get_node("../CanvasLayer/output")
	if response_code == 200:
		print("Succssd")
		output.text += "fun Deploy " +"Succssd\n"
	else:
		print("Failed")
