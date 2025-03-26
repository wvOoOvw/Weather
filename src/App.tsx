import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import city from './city.json'

interface IWeather {
  ymd: string
  high: string
  low: string
}

interface IFetchWetherParams {
  citycode: string
}

interface IFetchWetherResponse {
  cityInfo: {
    city: string
    parent: string
  }
  data: {
    forecast: IWeather[]
  }
}

const fetchWether = async (params: IFetchWetherParams): Promise<IFetchWetherResponse> => {
  const res = await fetch(`http://t.weather.itboy.net/api/weather/city/${params.citycode}`).then(res => res.json()).then(res => res)
  return res
}


function App() {
  const [weather, setWeather] = React.useState<IFetchWetherResponse | undefined>()
  const [cityOptions, setCityOptions] = React.useState(city)
  const [citySelect, setCitySelect] = React.useState<string | undefined>()

  React.useEffect(() => {
    if (citySelect) {
      fetchWether({ citycode: citySelect }).then(res => setWeather(res))
    }
  }, [citySelect])

  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, margin: 'auto', maxWidth: 720, padding: 24 }}>

    <FormControl style={{ marginBottom: 12 }} fullWidth size='small'>
      <InputLabel>选择城市</InputLabel>
      <Select label='选择城市' value={citySelect} onChange={e => setCitySelect(e.target.value)}>
        {
          cityOptions.filter((i, index) => i.city_code && i.city_name && index < 100).map((i, index) => {
            return <MenuItem key={index} value={i.city_code} style={{ fontSize: 14, padding: 8, minHeight: 'auto' }}>{i.city_name}</MenuItem>
          })
        }
      </Select>
    </FormControl>

    {
      weather ?
        <Paper>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>日期</TableCell>
                <TableCell>低温</TableCell>
                <TableCell>高温</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weather.data.forecast.map((row) => (
                <TableRow key={row.ymd}>
                  <TableCell>{row.ymd}</TableCell>
                  <TableCell>{row.low}</TableCell>
                  <TableCell>{row.high}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        :
        null
    }
  </div>
}

export default App