
<?php
header('Content-Type: text/plain;charset=utf-8');
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

$today=$date->format('Y-m-d');

//调试
$today="2021-05-21";


$sql = ["select * from zone","select * from record where `日期` like '".$today."' order by `时间段` ASC"];
 
$result = [mysqli_query( $conn, $sql[0] ),mysqli_query($conn,$sql[1])];

if(! $result[0] || ! $result[1])
{
    die('无法读取数据: ' . mysqli_error($conn));
}
if(mysqli_num_rows($result[0]) ==0){
       die('<h1>查询结果为空</h1>');
}

$zone=array();
$record=array("time"=>[],"number"=>[]);
$ceiling=0;
while($row = mysqli_fetch_array($result[0],MYSQLI_ASSOC)) {
    $zone[$row["区域"]] = $row["区域承载量"];
    $ceiling += (int)$row["区域承载量"];
} 
if(mysqli_num_rows($result[1]) !=0 ){    
   while($row = mysqli_fetch_array($result[1],MYSQLI_ASSOC)) {
      array_push($record["time"],$row["时间段"]);
      array_push($record["number"],$row["出场人数"]);
   } 
}

//计算预测值
//考虑边界值,确定计算方法

//设-1为非法值
$pTime=-1;
$pd_past=-1;
$pd_today=-1;
$pd=-1;
$past_data=array();
switch (true) {
    case (count($record["time"])==0 ):
        $pTime=9;
        break;
    case (12>count($record["time"])):
        $pTime=end($record["time"])+1;
        break;
    default:
        break;
}

if($pTime!=-1){
    //查询过去经验需要的数据
    $sql = "select `日期`,`出场人数` from `record` where `时间段` = '".$pTime."' and `日期` <'".$today.
        "'order by `日期` ASC limit 14";
    $result[2] = mysqli_query( $conn, $sql);
    if(!$result[2]){
        die('无法读取数据: ' . mysqli_error($conn));
    }
    if(mysqli_num_rows($result[2]) !=0 ){
        while($row = mysqli_fetch_array($result[2],MYSQLI_ASSOC)) {
            $past_data[$row["日期"]]= (int)$row["出场人数"];
        } 
        $pd_past=ceil(array_sum(array_values($past_data))/count($past_data));
    }
    mysqli_free_result($result[2]);

    //获得今日变化需要的数据
    if(count($record["number"]) > 1){
         $s=0;
         for($i=0;$i+1<count($record["number"]);$i++){
            $s += $record["number"][$i+1]-$record["number"][$i];
         }
         $pd_today=ceil($s/$i)+end($record["number"]);
    }
    
    if($pd_past==-1 && $pd_today!=-1){
        $pd=$pd_today>$ceiling? $ceiling :$pd_today;
    }
    if($pd_past!=-1 && $pd_today==-1){
        $pd=$pd_past;
    }
    if($pd_past!=-1 && $pd_today!=-1){
        $pd=ceil($pd_today*0.5+$pd_past*0.5) > $ceiling ? $ceiling : ceil($pd_today*0.5+$pd_past*0.5);
    }
    if($pd_past==-1 && $pd_today==-1){
        $pTime=-1;
    } 
}



//将数据编码为JSON格式
$data = json_encode(array("zone" => $zone,"record" => $record,"today"=>$today,
                    "predictTime" => $pTime,"predictData" => $pd));
                    //"totalCeiling" => $ceiling,
                   // "\$pd_today" => $pd_today, "\$pd_past" => $pd_past
//$time = date('r');
//echo "data: The server \ntime \nis: {$time}\n";
echo $data;

flush();
// 释放内存
mysqli_free_result($result[0]);
mysqli_free_result($result[1]);

mysqli_close($conn);
?>
