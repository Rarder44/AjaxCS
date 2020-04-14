<html>
    <head>
        <script src="jquery-3.5.0.min.js"></script>       
        <script>
            $(document).on( "AjaxCS_Loaded",function(){
                console.log("AjaxCS caricato");
                CheckeElement("AjaxCS");
                
            });
            $(document).ready(function(){
                console.log("document caricato");
                CheckeElement("document");
            });

            var CheckLoad={"AjaxCS":false,"document":false}
            function AllCheched()
            {
                for (const [key, value] of Object.entries(CheckLoad)) 
                {
                      if(!value)
                        return false;
                }
                return true;
            }
            function CheckeElement(Element)
            {
                CheckLoad[Element]=true;
                if(AllCheched())
                    Start();
            }




            var index=0;

            function Start()
            {
                //far partire il programma
                console.log("start");

                window.AjaxCS.Send("comando",{data:"aaa"},function(data,message)
                {
                    console.log(data);
                    console.log(message);

                });
                
                window.AjaxCS.createCyclicalSend("comando",{data:"ciclo"},function(data,message){
                    console.log(index++);
                    console.log(data);
                    console.log(message);
                },200,"ciclo1");
            }


            function StartCiclo()
            {
                window.AjaxCS.StartCyclical("ciclo1");
            }
            function StopCiclo()
            {
                window.AjaxCS.StopCyclical("ciclo1");
            }
        </script>
        <script src="AjaxCS.js"></script>
    </head>
    <body>
        <button onclick="StartCiclo()">Start</button>
        <button onclick="StopCiclo()">Stop</button>

    </body>
</html>