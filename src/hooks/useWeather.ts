import axios from "axios"  //PERMITE LA ABSTRACCION SOBRE FETCH API
import  {z} from 'zod'

import { SearchType} from "../types"
import { useMemo, useState } from "react"


//Zod
const Weather = z.object({ //es object por que es el valor que estamos obteniendo
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    })
})  

export type Weather = z.infer<typeof Weather>

//Reinciando el state de clima
const initialState = ({
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
})


export default function useWeather(){

    //State
    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoading ] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) =>{
        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)

        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const {data} = await axios.get(geoUrl)
            //const data = await axios(geoUrl, {method: 'get'}) //Other form

            //Comprobar si existe una ciudad
            if (!data[0]){
                setNotFound(true)
                return
            }

            const lat = data[0].lat //Aqui devuelve la latitud
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //Zod
            const {data: weatherResult} = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult) 
            if(result.success){
                setWeather(result.data)
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    //Se manda para ver si hay algo en clima y asi mostrar contenido
    const hasWeatherData = useMemo(()=> weather.name, [weather])

    return{
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData,
        
    }
}