<?php
//存储数据到MySQL_market_record
// 创建连接
$conn = mysqli_connect("127.0.0.1", "market", "", "market_");
// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
try {
    $date = new DateTime('');
} catch (Exception $e) {
    echo $e->getMessage();
    exit(1);
}

$day=$date->format('Y-m-d');
$timeSlice=array('9'=>0,'10'=>0,'11'=>0,'12'=>0,'13'=>0,'14'=>0,'15'=>0,'16'=>0,'17'=>0,'18'=>0,'19'=>0);
$ceiling=50+400+200+300;

$min=mt_rand($ceiling/20, $ceiling*0.3);
$max=mt_rand(0.6*$ceiling,$ceiling);


foreach (array_keys($timeSlice) as $k){
    $timeSlice[$k]=mt_rand($min,$max);
    echo "Key=" . $k . ", Value=" . $timeSlice[$k];
    echo "<br>";
}

$sql0 = "insert INTO `record`
        VALUES (?,?,?)";
// 预处理及绑定
$stmt = $conn->prepare($sql0);
$stmt->bind_param("sss", $day, $key, $value);
foreach ($timeSlice as $key => $value){
   echo "SQL: ".$sql0." value: ".$value;
   echo "<br>";
   $stmt->execute();
}
$stmt->close();
$conn->close();
?>

