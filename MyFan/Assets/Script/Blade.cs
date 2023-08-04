using UnityEngine;
using DG.Tweening;
public class Blade : MonoBehaviour
{
    public float z;
    public void SetSpeed(float speed)
    {
        if (speed == 0)
        {
            DOTween.To(() => z, y => z = y, speed, 5f);
        }
        else
        {
            DOTween.To(() => z, y => z = y, speed, 2.5f);
        }
    }
    void Update()
    {
        transform.Rotate(0, 0, z * Time.deltaTime);
    }
}
