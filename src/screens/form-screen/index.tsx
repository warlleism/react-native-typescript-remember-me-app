import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, TextInput, View, Text, Alert, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStarOfLife, faImage, faCamera, faTrash, faImages } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RenderData } from '../render-data';
import { Medicamento } from '../../interfaces/IMedicamentos';

const { width, height } = Dimensions.get('window');

const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export default function FormScreen() {
    const [content, setContent] = useState<Medicamento>({ id: generateUniqueId(), nome: '', funcao: '', imagem: null, date: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [contentSalvos, setContentSalvos] = useState<Medicamento[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modaImage, setModaImage] = useState<string | null>(null);
    const [renderDataVisible, setRenderDataVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModaImage(null);
    };

    const isSalvarButtonDisabled = () => {
        return !content.nome || !content.funcao || !content.imagem;
    };

    useEffect(() => {
        loadMedicamentos();
    }, []);

    const loadMedicamentos = async () => {
        try {
            const savedMedicamentos = await AsyncStorage.getItem('photos');
            if (savedMedicamentos) {
                setContentSalvos(JSON.parse(savedMedicamentos));
            }
        } catch (error) {
            return
        }
    };

    const savePhotos = async (novosMedicamentos: Medicamento[]) => {
        try {
            novosMedicamentos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            await AsyncStorage.setItem('photos', JSON.stringify(novosMedicamentos));
            setContentSalvos(novosMedicamentos);
        } catch (error) {
            return
        }
    };

    const pickImage = async (isCamera: boolean) => {
        let result: ImagePicker.ImagePickerResult;
        if (isCamera) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 1,
            });
        }
        if (!result.canceled) {
            setContent({ ...content, imagem: result.assets && result.assets[0]?.uri });
        }
    };


    const handleNomeChange = (text: string) => {
        setContent({ ...content, nome: text });
    };

    const handleFuncaoChange = (text: string) => {
        setContent({ ...content, funcao: text });
    };

    const handleSubmit = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "dd/MM/yyyy HH:mm", { locale: ptBR });
        const novoMedicamento = { ...content, id: generateUniqueId(), date: isEditing ? content.date : formattedDate };

        let novosMedicamentos;

        if (isEditing) {
            novosMedicamentos = contentSalvos.map((med) =>
                med.id === content.id ? { ...novoMedicamento } : med
            );
        } else {
            novosMedicamentos = [...contentSalvos, novoMedicamento];
        }

        await savePhotos(novosMedicamentos);
        setContent({
            id: generateUniqueId(), nome: '', funcao: '', imagem: null, date: ''
        });
        setIsEditing(false);
        showRenderData()
    };

    const handleEdit = (data: Medicamento) => {
        setContent(data);
        setIsEditing(true);
        hideRenderData()
    };

    const handleCancelEdit = () => {
        setContent({ id: generateUniqueId(), nome: '', funcao: '', imagem: null, date: '' });
        setIsEditing(false);
    };

    const handleExcluirMedicamento = async (id: string) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja excluir este content?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            const medicamentosAtualizados = contentSalvos.filter(med => med.id !== id);
                            await savePhotos(medicamentosAtualizados);
                        } catch (error) {
                            return
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const showRenderData = () => {
        setRenderDataVisible(true);
    };

    const hideRenderData = () => {
        setRenderDataVisible(false);
    };

    return (
        <>
            {renderDataVisible ?
                <View>
                    <ScrollView style={{ width: width }}>
                        <View>
                            <RenderData
                                onPress={renderDataVisible ? hideRenderData : showRenderData}
                                contentSalvos={contentSalvos ? contentSalvos : []}
                                setModaImage={setModaImage}
                                openModal={openModal}
                                modalVisible={modalVisible}
                                closeModal={closeModal}
                                modaImage={modaImage}
                                handleEdit={handleEdit}
                                handleExcluirMedicamento={handleExcluirMedicamento}
                            />
                        </View>
                    </ScrollView>
                </View>
                :
                <ScrollView>
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: width, marginBottom: 30, }}>
                            <TouchableOpacity style={{ borderRadius: 10, backgroundColor: '#6200ff', borderColor: '#4500b4', borderWidth: 2, padding: 15, position: 'absolute', top: 20, right: 10 }} onPress={renderDataVisible ? hideRenderData : showRenderData}>
                                <FontAwesomeIcon size={25} color='#fff' icon={faImages} />
                            </TouchableOpacity>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 50, marginTop: 20 }}>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 100 }}>
                                    <FontAwesomeIcon icon={faStarOfLife} size={50} color="#6200ff" />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 30, fontWeight: '800', color: "#3e3e3e" }}>Snap</Text>
                                    <Text style={{ fontSize: 30, fontWeight: '800', color: "#6200ff" }}>Info</Text>
                                </View>
                            </View>
                            <View>
                                {content.imagem ?
                                    <View>
                                        <Image source={{ uri: content.imagem }} style={{ width: width - 50, height: 300, borderRadius: 5, marginBottom: 30 }} />
                                        <TouchableOpacity style={{ position: "absolute", top: 10, right: 10 }} onPress={() => setContent({ ...content, imagem: '' })}>
                                            <FontAwesomeIcon icon={faTrash} size={20} color='#ff004ccc' />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => pickImage(false)} style={{ backgroundColor: "#dfdfdff4", width: width - 50, height: 300, borderRadius: 5, marginBottom: 30, justifyContent: 'center', alignItems: 'center' }}>
                                        <FontAwesomeIcon size={120} color='#c2c1c4' icon={faCamera} />
                                    </TouchableOpacity>
                                }
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ marginBottom: 5 }}>Nome da foto</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={content.nome}
                                        onChangeText={handleNomeChange}
                                    />
                                </View>
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ marginBottom: 5 }}>Descrição</Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline={true}
                                        defaultValue={content.funcao}
                                        onChangeText={handleFuncaoChange}
                                    />
                                </View>
                                <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
                                    <FontAwesomeIcon size={30} color='#6200ff' icon={faImage} />
                                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#6200ff' }}>Escolher uma imagem</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
                                    <FontAwesomeIcon size={30} color='#6200ff' icon={faCamera} />
                                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#6200ff' }}>Tirar uma foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={isSalvarButtonDisabled()}
                                    style={[
                                        styles.button,
                                        { backgroundColor: '#6200ff', opacity: isSalvarButtonDisabled() ? 0.7 : 1 }
                                    ]}
                                    onPress={handleSubmit}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: '800', color: "#ffffff" }}>{isEditing ? 'Editar' : 'Salvar'}</Text>
                                </TouchableOpacity>
                                {
                                    isEditing && (
                                        <TouchableOpacity style={[styles.button, { backgroundColor: '#6200ff' }]} onPress={handleCancelEdit}>
                                            <Text style={{ fontSize: 20, fontWeight: '800', color: "#ffffff" }}>Cancelar</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            }

        </>

    );
}
const styles = StyleSheet.create({
    input: {
        height: 60,
        fontSize: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: width - 50,
        backgroundColor: '#e2e2e2'
    },
    button: {
        flexDirection: 'row',
        gap: 12,
        width: width - 50,
        borderWidth: 2,
        borderColor: '#6200ff',
        color: '#161616',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginBottom: 10,
        borderRadius: 5,
    },
});
