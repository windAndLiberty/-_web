<?php 
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
// 创建连接
$conn = mysqli_connect("127.0.0.1", "market", "", "market_");
// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "select `性别`,count(*) 'amount' from people group by `区域`,`性别` having `区域` = " ;

$data=array(
    'time' => date('H:i:s'),
    'zone' => [
    'A'=>['m'=>0,'w'=>0],
    'B'=>['m'=>0,'w'=>0],
    'C'=>['m'=>0,'w'=>0],
    'D'=>['m'=>0,'w'=>0]
    ]
);
$zone= array_keys($data['zone']);
$i=0;
$i_value='';
foreach($zone as $i => $i_value){
   $result = mysqli_query( $conn, $sql."'".$i_value."'");

    if(! $result){
       echo 'data:error massage: ' . mysqli_error($conn).'\n\n';
       die();
    }
    if(mysqli_num_rows($result) ==0 ){
        continue;
    }
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
        $data['zone'][$i_value][$row["性别"]] =  $row['amount'];
    }

    // 释放内存
    mysqli_free_result($result);
}


mysqli_close($conn);


echo "data:".json_encode($data)."\n\n";


flush();
?>
