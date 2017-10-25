var ingrediente=argument[0]
var lugar=argument[1]

if lugar<10 && ob_plancha_BB.preparado[9]==0
{
if ob_plancha_BB.preparado[lugar]==0
{
ob_plancha_BB.preparado[lugar]=ingrediente
return 1
exit
}
else
{

//show_message("intento "+string(lugar+1))
script_execute(preparacion, ob_plancha_BB.preparado[lugar], lugar+1)
ob_plancha_BB.preparado[lugar]=ingrediente

}}
return 0




