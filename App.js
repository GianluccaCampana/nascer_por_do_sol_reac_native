import { useState } from 'react';
import {
  Button,
  FlatList,
  Image, 
  StyleSheet, 
  Text,
  TextInput, 
  View 
} from 'react-native';
import Cartao from './components/Cartao'


import PrevisaoItem from './components/PrevisaoItem';


export default function App() {
  const [cidade, setCidade] = useState('')
  const [previsoes, setPrevisoes] = useState([])
  const capturarCidade = (cidadeDigitada) => {
    setCidade(cidadeDigitada)
  }
    const lang = 'pt_br'
    const units = 'metric'
    const cnt = 10
    const appid = '06e35e6de1655036cacbdeeb29377ee6'

  const obterPrevisoes= () => {
    const chamandoAPI1 = `https://api.openweathermap.org/data/2.5/forecast?lang=${lang}&units=${units}&cnt=${cnt}&appid=${appid}&q=${cidade}` 
    //const chamandoAPI2 =  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${appid}`
    fetch(chamandoAPI1)
    .then(response => {
      return response.json()
    })
    .then(dados => {
      let lat = dados.city.coord.lat
      let lon = dados.city.coord.lon
      fetch(encodeURI(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${appid}`))
      .then(response =>{
        return response.json()
      })
      .then(dados =>{
        //setPrevisoes(dados['current'])
        setPrevisoes(previsoes =>{
          return[{sunrise: dados.current.sunrise,sunset: dados.current.sunset,feelsLike: dados.current.feels_like, 
                  iconUrl: 'https://openweathermap.org/img/wn/' + dados.current.weather[0].icon + '.png' }]
        })
        
        
      })
    })
  }
  return (
    <View style={styles.containerView}>
      <View style={styles.entradaView}>
        <TextInput 
          style={styles.cidadeTextInput}
          placeholder="Digite o nome de uma cidade"
          value={cidade}
          onChangeText={capturarCidade}
        />
        <Button 
          title="OK"
          onPress={obterPrevisoes}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <FlatList 
          data={previsoes}
          renderItem={p => (
           /*<PrevisaoItem previsao={p.item}/>*/
           <Cartao
            estilos={telasDasPrevisoes.cartao}>
            <View
                style={telasDasPrevisoes.tela}>
                <Image 
                    style={telasDasPrevisoes.imagem}
                    source={{uri: p.item.iconUrl}}
                />
                <View>                   
                    <View style={telasDasPrevisoes.segundaLinha}>
                        <Text>Nascer do Sol: {new Date(Number(p.item.sunrise * 1000)).toLocaleString()}</Text>
                        <Text>Por do Sol: {new Date(Number(p.item.sunset * 1000)).toLocaleString()}</Text>
                        <Text>Sensação Térmica: {p.item.feelsLike} {'\u00B0C'}</Text>                       
                    </View>
                </View>

            </View>

        </Cartao>

          )}
        />   
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {
    padding: 40
  },
  entradaView: {
    marginBottom: 8,
  },
  cidadeTextInput: {
    padding: 12,
    borderBottomColor: '#FF9800',
    borderBottomWidth: 2,
    marginBottom: 4
  }

  
});


const telasDasPrevisoes = StyleSheet.create({
  cartao: {
      marginBottom: 8
  },
  tela: {
      flexDirection: 'row'
  },
  imagem: {
      width: 50,
      height: 50
  },
  primeiraLinha: {
      flexDirection: 'row',
      justifyContent: 'center'
  },
  segundaLinha: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 4,
      borderTopWidth: 1,
      borderTopColor: '#DDD'
  },
  valor: {
      marginHorizontal: 2
  }
})