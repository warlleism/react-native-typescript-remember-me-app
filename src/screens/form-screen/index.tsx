import React, { useContext } from 'react';
import { StyleSheet, Image, TextInput, View, Text, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStarOfLife, faImage, faCamera, faTrash, faImages } from '@fortawesome/free-solid-svg-icons';
import { RenderData } from '../render-data';
import { ContentContext, ContentContextProps } from '../../context/formContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function FormScreen() {

    const {
        content,
        setContent,
        isEditing,
        handleSubmit,
        handleCancelEdit,
        pickImage,
        isSalvarButtonDisabled
    } = useContext<ContentContextProps | any>(ContentContext);

    const navigation = useNavigation()


    return (
        <>
            <ScrollView>
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: width, marginBottom: 30, }}>
                        <TouchableOpacity style={{ borderRadius: 10, backgroundColor: '#6200ff', borderColor: '#4500b4', borderWidth: 2, padding: 15, position: 'absolute', top: 20, right: 10 }} onPress={() => navigation.navigate('AllData' as never)}>
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
                                    onChangeText={(text) => setContent({ ...content, nome: text })}
                                />
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ marginBottom: 5 }}>Descrição</Text>
                                <TextInput
                                    style={styles.input}
                                    multiline={true}
                                    defaultValue={content.funcao}
                                    onChangeText={(text) => setContent({ ...content, funcao: text })}
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
