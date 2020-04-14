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






            function Start()
            {
                //far partire il programma
                console.log("start");

                window.AjaxCS.Send("comando",{data:"aaa"},function(data,message)
                {
                    console.log(data);
                    console.log(message);

                });
                


            }

        </script>
        <script src="AjaxCS.js"></script>
    </head>
    <body>
        
    </body>
</html>