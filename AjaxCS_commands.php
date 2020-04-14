<?php 
//questo file va modificato secondo la struttura proposta

//l'array associativo Commands prevede:
//- chiave -> il Comando che verra richiesto dal JS 
//- valore -> una funzione anonima ( o il riferimento ad una funzione che accetta una variabile $Data -> un array associativo dei dati passati al comando)


//Usare la funzione RET per ritornare un valore/messaggio alla pagina ( questa funzione blocca l'esecuzione della pagina)
$Commands=array();


$Commands["comando"]=function($Data)
{
    RET($Data);
};





function RET($data,$message="OK")
{
    echo json_encode(array("data"=>$data,"message"=>$message));
    exit();
}
?>