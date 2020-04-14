<?php

include_once("AjaxCS_commands.php");


//Controllo se c'è un comando
$_METHOD=null;
if (isset($_POST["command"]))
{
    $_METHOD=$_POST;
}
else if (isset($_GET["command"]))
{
    $_METHOD=$_GET;
}
else
{
    RET(null,"AjaxCS.php - command non found in any method");
}



$CurrentCommand=$_METHOD["command"];
$CommandFound=false;
foreach($Commands as $command=>$function)
{
    if($CurrentCommand==$command)
    {
        $function($_METHOD["data"]);
        $CommandFound=true;
        break;
    }
}

if($CommandFound)
{
    RET(null,"AjaxCS.php - the command does't return anything");
}
else
{
    RET(null,"AjaxCS.php - command not found");
}










?>