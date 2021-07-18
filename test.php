<?php
//存储数据到MySQL_market_people
// 创建连接
$conn = mysqli_connect("127.0.0.1", "market", "", "market_");
// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$zone='D';
$sex='w';
//重复插入的次数
$number=130;
$sql = "insert INTO `people` ( `区域`, `性别`) 
        VALUES ('".$zone."', '".$sex."')";
$i=0;
for(;$i<$number;$i++){
   mysqli_query($conn,$sql);
}




mysqli_close($conn);
?>

