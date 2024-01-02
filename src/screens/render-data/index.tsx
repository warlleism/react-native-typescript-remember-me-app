import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Modal, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faXmark, faArrowLeft, faStarOfLife, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-picker/picker';
import { Medicamento } from '../../interfaces/IMedicamentos';
import { ContentContext, ContentContextProps } from '../../context/formContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');


export const RenderData: React.FC = () => {

    const {
        contentSalvos,
        modalVisible,
        modaImage,
        setModaImage,
        openModal,
        closeModal,
        handleEdit,
        handleExcluirMedicamento,
    } = useContext<ContentContextProps | any>(ContentContext);

    const navigation = useNavigation()

    const [selectedMonth, setSelectedMonth] = useState<string>('null');
    const [searchText, setSearchText] = useState<string>('');

    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const filteredContent =
        selectedMonth === 'null'
            ? contentSalvos.filter((item: any) => item.nome.toLowerCase().includes(searchText.toLowerCase()))
            : contentSalvos.filter((item: any) =>
                item.nome.toLowerCase().includes(searchText.toLowerCase()) &&
                item.date.slice(3, 5) === selectedMonth
            );

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (modalVisible) {
                    closeModal();
                    return true;
                }
                return false;
            }
        );

        return () => backHandler.remove();
    }, [modalVisible, closeModal]);


    return (
        <View style={{ paddingHorizontal: 10 }}>
            <View style={{ height: 100, width: width, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 30 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={{ width: 50, height: 50, }} >
                    <FontAwesomeIcon icon={faArrowLeft} size={40} color='#1d1d1dcc' />
                </TouchableOpacity>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, padding: 8, borderRadius: 100 }}>
                    <FontAwesomeIcon icon={faStarOfLife} size={40} color="#6200ff" />
                </View>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 100 }} />
            </View>
            <View style={{ alignSelf: 'center', width: "100%", flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 }}>
                <TextInput
                    onChangeText={handleSearchChange}
                    value={searchText}
                    placeholder='Buscar'
                    placeholderTextColor={'#5756563b'}
                    style={{
                        width: '64%',
                        paddingHorizontal: 10,
                        height: 50,
                        fontSize: 24,
                        borderWidth: 2,
                        borderColor: "#6200ff",
                        borderRadius: 5,
                    }}
                />
                <View style={{ width: '35%', height: 50, borderWidth: 2, borderColor: "#6200ff", borderRadius: 5 }}>
                    <Picker
                        style={{ marginTop: -5 }}
                        selectedValue={selectedMonth}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedMonth(itemValue)
                        }>
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="mês" value="null" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jan" value="01" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="fev" value="02" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="abr" value="03" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="mar" value="04" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="mai" value="05" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jun" value="06" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jul" value="07" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="ago" value="08" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="set" value="09" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="out" value="10" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="nov" value="11" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="dez" value="12" />
                    </Picker>
                </View>
            </View>
            {filteredContent.length === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: height / 2 }}>
                    <FontAwesomeIcon icon={faCamera} size={130} color="#6200ff" />
                    <Text style={{ fontSize: 30, marginTop: 10, textAlign: 'center', color: '#666666', fontWeight: '500' }}>Nenhum medicamento cadastrado ainda.</Text>
                </View>
            ) : (
                filteredContent.map((item: any, index: any) => (
                    <View key={index} style={styles.containerContent}>
                        {item.imagem && (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModaImage(item.imagem);
                                        openModal();
                                    }}>
                                    <Image source={{ uri: item.imagem }} style={{ width: '100%', height: 260, borderRadius: 5 }} />
                                </TouchableOpacity>
                                <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
                                    <View style={{ height: height, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                                        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, padding: 10, borderRadius: 100 }} onPress={closeModal}>
                                            <FontAwesomeIcon icon={faXmark} size={30} color='#fff' />
                                        </TouchableOpacity>
                                        <Image source={{ uri: modaImage || undefined }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />
                                    </View>
                                </Modal>
                            </>
                        )}
                        <Text style={{ fontSize: 25, fontWeight: '500', color: "#444444", marginTop: 20 }}>{item.nome}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '300', color: "#444444" }}>{item.funcao}</Text>
                        <Text style={{ fontSize: 13, letterSpacing: -1, fontWeight: '300', color: "#44444475" }}>{item.date}</Text>
                        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, right: 10, gap: 10 }}>
                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <FontAwesomeIcon icon={faPenToSquare} size={20} color='#1d1d1dcc' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleExcluirMedicamento(item.id)}>
                                <FontAwesomeIcon icon={faTrashCan} size={20} color='#6200ff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containerContent: {
        width: '100%',
        marginBottom: 60,
        borderRadius: 5,
    }
});
