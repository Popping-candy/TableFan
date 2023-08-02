extends CanvasLayer
var host = "http://192.168.179.133:8000"
var path = [
	"/createDeviceTable",
	"/CreateEffect/fan",
	"/fans"
	]
var headers = [
	"Content-Type: application/json",
	"Accept: application/json",
	"api-version: 0.1"
	]
var file_path = [
	"res://json/DeviceTable.json",
	"res://json/effect.json",
	"res://json/order.json"
	]
var times = 0
var text
# Called when the node enters the scene tree for the first time.
func _ready():
	pass

func _on_Button_pressed():
#	$HTTPRequest1.request("http://www.mocky.io/v2/5185415ba171ea3a00704eed")
	var file = File.new()
	var json_data
	var json_content
	if file.open(file_path[0], File.READ) == OK:
		json_content = file.get_as_text()
		file.close()
	else:
		print("无法打开文件")
	var url = host + path[0]
	$HTTPRequest1.request(url, headers, true, HTTPClient.METHOD_GET, json_content)
	

func _on_HTTPRequest1_request_completed(result, response_code, headers, body):
	request_back(result, response_code, headers, body)

func _on_Button2_pressed():
	var file = File.new()
	var json_data = {}
	if file.open(file_path[1], File.READ) == OK:
		var json_str = file.get_as_text()
		var parse_result = JSON.parse(json_str)
		json_data = parse_result.result
		file.close()
	else:
		print("无法打开文件")
	var effect_data = json_data["effect"][0]
	var updated_json_str = JSON.print(effect_data)
	var url = host + path[1]
	$HTTPRequest1.request(url, headers, true, HTTPClient.METHOD_GET, updated_json_str)


func _on_Button3_pressed():
	var file = File.new()
	var json_data = {}
	if file.open(file_path[2], File.READ) == OK:
		var json_str = file.get_as_text()
		var parse_result = JSON.parse(json_str)
		json_data = parse_result.result
		file.close()
	else:
		print("无法打开文件")
	var effect_data = json_data["order"][0]
	var updated_json_str = JSON.print(effect_data)
	var url = host + path[2]
	$HTTPRequest1.request(url, headers, true, HTTPClient.METHOD_GET, updated_json_str)

func request_back(result, response_code, headers, body):
	if response_code == 200:
		var xml_parser = XMLParser.new()
		if xml_parser.open_buffer(body) == OK:
			while xml_parser.read() == OK:
				if xml_parser.get_node_type() == XMLParser.NODE_ELEMENT:
					print(xml_parser.get_node_data())
					text = xml_parser.get_node_data()
					$TextEdit.text += text + "\n"
				elif xml_parser.get_node_type() == XMLParser.NODE_ELEMENT_END:
					print(xml_parser.get_node_data())
					text = xml_parser.get_node_data()
					$TextEdit.text += text + "\n"
				elif xml_parser.get_node_type() == XMLParser.NODE_TEXT:
					print(xml_parser.get_node_data())
					text = xml_parser.get_node_data()
					$TextEdit.text += text + "\n"
		else:
			print("解析失败！")
	else:
		print("请求失败！")
		print("响应码：", response_code)
		print("错误信息：", result)
