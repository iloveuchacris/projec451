// ✅ Import รูปภาพจาก assets
import aaa from '../../assets/photohome/aaa.jpg';
import bbb from '../../assets/photohome/bbb.jpg';
import ccc from '../../assets/photohome/ccc.jpg';
import ddd from '../../assets/photohome/ddd.jpg';
import eee from '../../assets/photohome/eee.jpg';
import nonphoto from '../../assets/photohome/nonphoto.jpg';

export const RESTAURANTS = [
  {
    id: '1',
    name: 'BLUE by Alain Ducasse',
    rating: '4.5',
    image: aaa,
    category: 'Fine Dining',
    location: 'ICONSIAM, Bangkok',
    description: 'สัมผัสประสบการณ์อาหารฝรั่งเศสระดับมิชลินสตาร์ รังสรรค์เมนูโดยเชฟระดับโลกในบรรยากาศที่สวยงามที่สุด',
    isRecommended: true,
  },
  {
    id: '2',
    name: 'Ojo Bangkok',
    rating: '4.5',
    image: bbb,
    category: 'Mexican Cuisine',
    location: 'The Standard, Bangkok',
    description: 'ลิ้มรสอาหารเม็กซิกันสไตล์โมเดิร์น พร้อมวิวเมืองกรุงเทพฯ แบบ 360 องศา',
    isRecommended: true,
  },
  {
    id: '3',
    name: 'Rim Rooftop Dining & Bar',
    rating: '4.4',
    image: ccc,
    category: 'Rooftop Bar',
    location: 'Pranakorn, Bangkok',
    description: 'ดื่มด่ำกับบรรยากาศสุดโรแมนติกริมแม่น้ำเจ้าพระยา พร้อมเครื่องดื่มและอาหารเลิศรส',
    isRecommended: true,
  },
  {
    id: '4',
    name: 'Char Bangkok',
    rating: '4.6',
    image: ddd,
    category: 'Grill & Bar',
    location: 'Wireless Road, Bangkok',
    description: 'ห้องอาหารกริลล์สเต็กระดับพรีเมียม พร้อมบรรยากาศ Rooftop ใจกลางย่านวิทยุ',
    isRecommended: true,
  },
  {
    id: '5',
    name: 'oxbo bangkok',
    rating: '4.8',
    image: eee,
    category: 'International',
    location: 'Hilton Sukhumvit',
    description: 'บุฟเฟต์นานาชาติและอาหาร A La Carte คุณภาพเยี่ยมในบรรยากาศเป็นกันเอง',
    isRecommended: true,
  },
];