import ConfigImage from "../../../../components/Channel/ConfigImage";
import "./CustomizeProfile.css";
import ConfigText from "../../../../components/Channel/ConfigText";
import ConfigTextBox from "../../../../components/Channel/ConfigTextBox";

export default function CustomizeProfile({ valuesChanged, values, formError }) {
  return (
    <div id="custom-profile">
      <ConfigImage
        title="Imagem do banner"
        subTitle="Essa imagem aparecerá na parte superior do canal"
        text="Para garantir os melhores resultados em todos os dispositivos,
         escolha uma imagem de ate 6mb com pelo menos 1.024 x 576 pixels."
        imgBox="Banner"
        valuesChanged={valuesChanged}
        valueImage={{ tv: values.tv, pc: values.pc, cel: values.cel }}
      />
      <ConfigImage
        title="Foto"
        subTitle="A foto do perfil será exibida onde seu canal aparecer no YouTube,
                   como ao lado dos seus vídeos e comentários"
        text="Recomendamos usar uma imagem de até 4 MB com pelo menos 98 X 98 pixels.
               Use um arquivo no formato PNG ou GIF ( sem animações )."
        imgBox="Photo"
        valuesChanged={valuesChanged}
        valueImage={values.photo}
      />
      <ConfigText
        title="Nome"
        subTitle="Escolha um nome para o canal que tenha a ver com voce e seu conteúdo. É possivel mudar uma vez a cada 24hr"
        valuesChanged={valuesChanged}
        valueKey={"name"}
        values={values.name}
        error={formError.name}
      />
      <ConfigText
        title="Identificador"
        subTitle="Escolha um identificador exclusivo adicionando letras e números. É possivel mudar uma vez a cada 24hr"
        example="https://www.mytube.com/@"
        valuesChanged={valuesChanged}
        valueKey={"identify"}
        values={values.identify}
        error={formError.identify}
      />
      <ConfigText
        title="Pronomes"
        subTitle="Adicione seus pronomes, se quiser. Indique como outras pessoas devem se referir a você. Edite ou exclua os pronomes quando quiser."
        valuesChanged={valuesChanged}
        valueKey={"pronouns"}
        values={values.pronouns}
        error={formError.pronouns}
      />
      <ConfigTextBox
        title="Descrição"
        placeholder='Fale um pouco sobre seu canal para os espectadores. Essa descrição aparecerá na seção "sobre" do canal.'
        valuesChanged={valuesChanged}
        valueKey={"description"}
        values={values.description}
        error={formError.description}
      />
    </div>
  );
}
