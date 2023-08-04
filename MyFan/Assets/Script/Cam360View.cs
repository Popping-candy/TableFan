using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class Cam360View : MonoBehaviour
{
    public Transform target;
    public float xSpeed = 1000;
    public float ySpeed = 1000;
    public float wheelSpeed = 20;
    public float yMinLimit = -50;
    public float yMaxLimit = 50;
    public float distance = 100;
    public float minDistance = 2;
    public float maxDistance = 200;
    float speed = 5.0f;
    public float x = 0.0f;
    public float y = 0.0f;
    void Start()
    {
        Vector3 angles = transform.eulerAngles;
        x = angles.y;
        y = angles.x;
    }
    void LateUpdate()
    {
        if (target)
        {
            if (Input.GetMouseButton(1)) //right click
            {
                x += Input.GetAxis("Mouse X") * xSpeed * 0.02f;
                x = ClampAngle(x);
                y -= Input.GetAxis("Mouse Y") * xSpeed * 0.02f;
                y = Mathf.Clamp(y, yMinLimit, yMaxLimit);
            }
            distance -= Input.GetAxis("Mouse ScrollWheel") * wheelSpeed;
            distance = Mathf.Clamp(distance, minDistance, maxDistance);
            Quaternion rotation = Quaternion.Euler(y, x, 0.0f);
            Vector3 disVector = new Vector3(0.0f, 0.0f, -distance);
            Vector3 position = rotation * disVector + target.position;
            transform.rotation = Quaternion.Lerp(transform.rotation, rotation, Time.deltaTime * speed);
            transform.position = Vector3.Lerp(transform.position, position, Time.deltaTime * speed);
        }
    }
    static float ClampAngle(float angle)
    {
        if (angle < 0)
            angle += 360;
        if (angle > 360)
            angle -= 360;
        return angle;
    }
}
