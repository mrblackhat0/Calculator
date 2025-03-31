import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const buttonList = [
  'AC', '_', 'X', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '00', '.', '='
]

const { width } = Dimensions.get('screen')
export default function Index() {
  const [result, setResult] = useState('')
  const [rawData, setRawData] = useState('0')

  const handleButtonPress = (index: number) => {
    const operators = /[+\-÷×]/
    if (index === 0) {
      setRawData('0')
      setResult('')
      return
    }
    // PLUS-MINUS Toggle
    else if (index === 1) {
      setRawData(String(result ? (+result * (-1)) : eval(rawData) * (-1)))
      setResult(String(result ? (+result * (-1)) : ''))
    }
    // checking duplication for Operators
    else if ((operators.test(buttonList[index]))) {
      if (operators.test(rawData[rawData.length - 1])) {
        const modData = rawData.slice(0, -1) + buttonList[index]
        setRawData(modData)
      } else {
        setRawData(rawData + buttonList[index])
      }
    }

    else if (index === 2) {
      if (rawData.length === 1) {
        setRawData('0')
      } else {
        const trimmedData = rawData.slice(0, -1)
        setRawData(trimmedData)
        if (operators.test(trimmedData) && !operators.test(trimmedData.at(-1) || '')) {
          let filteredData = trimmedData.replaceAll('÷', '/')
          filteredData = filteredData.replaceAll('×', '*')
          setResult(String(eval(filteredData)))
        }
        else {
          setResult('')
        }
      }
    }
    else if (index === 18) {
      const listOfVal = rawData.split(operators)
      if (listOfVal[listOfVal.length - 1].includes('.')) return
      if (listOfVal[listOfVal.length - 1]) setRawData(rawData + '.')
      else setRawData(rawData + '0.')

    }
    else if (index === 19) handleEquals()
    else {
      // ADDING NUMBERS && SHOWING RESULTS
      if (rawData === '0') {
        setRawData(buttonList[index])
      } else {
        const listOfVal = rawData.split(operators)
        const lastVal = listOfVal[listOfVal.length - 1]
        let modData = rawData
        if (index === 17) {
          if (lastVal === '0') return
          modData = !lastVal ? (rawData + '0') : (rawData + '00')
        } else {
          modData = lastVal === '0' ?
            rawData.slice(0, -1) + buttonList[index] :
            (rawData + buttonList[index])
        }
        setRawData(modData)
        if (operators.test(modData)) {
          let filteredData = modData.replaceAll('÷', '/')
          filteredData = filteredData.replaceAll('×', '*')
          setResult(String(eval(filteredData)))
        }
      }
    }
  }

  const handleEquals = () => {
    if (!result) return
    setResult('')
    setRawData(result)
  }

  const getFontSize = (length: number) => {
    return Math.max(54 - length * 8, 24); // Reduce size as length increases
  };

  return (
    <View style={styles.container} >
      {/* Raw Result */}
      <FlatList
        data={rawData.split('').reverse()}
        keyExtractor={(_, index) => index.toString()}
        style={{ maxHeight: 155, top: 90, marginVertical: 16 }}
        inverted
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        scrollToOverflowEnabled={true}
        ListEmptyComponent={() => <Text style={[styles.item, { fontSize: 54, marginTop: -3.5 }]}>0</Text>}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Text style={[styles.item, { fontSize: getFontSize(Math.floor(rawData.length / (16))) }]}>
            {item}
          </Text>
        )}
      />

      {/* Result */}
      <Text style={styles.result}>{result}</Text>

      {/* All the Buttons */}
      <FlatList
        style={{ maxHeight: (width - 16) / 4 * 5, marginVertical: 20 }}
        contentContainerStyle={{
          flex: 1,
          width: '100%',
          justifyContent: 'space-between',
        }}
        data={buttonList}
        keyExtractor={(item) => item}
        numColumns={4}
        renderItem={({ item, index }) => (
          <Button item={item} index={index} press={() => handleButtonPress(index)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    padding: 8,
    justifyContent: 'space-between',
  },
  listContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    flexWrap: 'wrap'
  },
  item: {
    textAlign: "right",
    color: '#fff'
  },
  result: {
    color: '#bcbcbc',
    fontSize: 32,
    textAlign: 'right',
    marginTop: 70,
    paddingHorizontal: 20
  },
  button: {
    width: 85,
    height: 85,
    backgroundColor: '#2b2b2b',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
  },
})

type IconList = 'divide' | 'x' | 'minus' | 'plus'
const iconsSign: IconList[] = ['divide', 'x', 'minus', 'plus']

const Button = ({ item, index, press }: { item: string, index: number, press: () => void }) => {
  return (
    <TouchableOpacity
      onPress={press}
      style={[styles.button, {
        backgroundColor: item === '=' ? '#bf6504' : ((index < 4 || (index + 1) % 4 === 0) ? '#1b1b1b' : '#3c3c3c'),
      }]}>
      {(index + 1) % 4 ?
        // Delete Button
        (index === 1 ?
          <MaterialCommunityIcons name="plus-minus-variant" size={32} color="#fff" />
          :
          // Numbers 
          (index === 2 ?
            <Feather name="delete" color={'#fff'} size={32} />
            :
            <Text style={styles.buttonText}>{item}</Text>
          )
        )
        :

        (item === '=' ?
          <FontAwesome6 name="equals" color={'#fff'} size={32} />
          :
          // All Operators
          <Feather name={iconsSign[(index - 3) / 4]} color={'#fff'} size={32} />)
      }
    </TouchableOpacity>
  )
}
