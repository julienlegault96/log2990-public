#include "inf2705-fenetre.h"
#include <stdio.h>
#include "inf2705-nuanceur.h"
#include"Default3DProgramState.h"
#include "Camera.h"
#include "Planet.h"
#include "Spaceship.h"
#include "Image.h"

// variables pour l'utilisation des nuanceurs
GLuint progBase;  // le programme de nuanceurs de base
GLuint ubo[3];

GLint locNormal;
GLint locColor = -1;
GLint locmatrModel = -1;
GLint locmatrVisu = -1;
GLint locmatrProj = -1;
GLint locmatrNormale;
GLint locplanCoupe;
GLuint indLightSource;
GLuint indFrontMaterial;
GLuint indLightModel;

static Default3DProgramState * etat = Default3DProgramState::obtenirInstance();


// matrices du pipeline graphique
MatricePipeline matrModel, matrVisu, matrProj;
// les formes
// d�finition des lumi�res

GLuint textureId;

// variables pour d�finir le point de vue
Camera camera;

glm::ivec2 sourisPosPrec(0, 0);
static bool pressed = false;

void Fenetre::initialiser(std::string absolutePath, bool geo, int objectsAmount, const char * sceneOptions)
{
    // donner la couleur de fond
    glClearColor(0.2, 0.21, 0.26, 1.0);
    // allouer les UBO pour les variables uniformes
    glGenBuffers(3, ubo);
    // activer les etats openGL
    glEnable(GL_DEPTH_TEST);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glEnable(GL_BLEND);

    // charger les ressources
    chargerNuanceurs(absolutePath);
    chargerTextures();

    // cr�er quelques autres formes
    glUseProgram(progBase);

    scene = new Scene(objectsAmount, geo);
    scene->parseModOptions(sceneOptions);
}

void Fenetre::conclure()
{
    glDeleteBuffers(3, ubo);
    delete scene;
    scene = nullptr;
}

void Fenetre::afficherScene()
{
    // effacer l'ecran et le tampon de profondeur
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glUseProgram(progBase);

    // d�finir le pipeline graphique
    matrProj.Perspective(20.0, (GLdouble)largeur_ / (GLdouble)hauteur_, 0.1, 100.0);
    glUniformMatrix4fv(locmatrProj, 1, GL_FALSE, matrProj); // informer la carte graphique des changements faits � la matrice

    camera.executeChanges(matrVisu);
    glUniformMatrix4fv(locmatrVisu, 1, GL_FALSE, matrVisu); // informer la carte graphique des changements faits � la matrice

    matrModel.LoadIdentity();
    glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel); // informer la carte graphique des changements faits � la matrice

    glUniformMatrix3fv(locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu.getMatr() * matrModel.getMatr()))));

    // afficher les axes
    if (etat->state.afficheAxes) Fenetre::afficherAxes();

    // mettre � jour les blocs de variables uniformes
    {
        glBindBuffer(GL_UNIFORM_BUFFER, ubo[0]);
        GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
        memcpy(p, &etat->LightSource, sizeof(etat->LightSource));
        glUnmapBuffer(GL_UNIFORM_BUFFER);
    }
    {
        glBindBuffer(GL_UNIFORM_BUFFER, ubo[1]);
        GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
        memcpy(p, &etat->FrontMaterial, sizeof(etat->FrontMaterial));
        glUnmapBuffer(GL_UNIFORM_BUFFER);
    }
    {
        glBindBuffer(GL_UNIFORM_BUFFER, ubo[2]);
        GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
        memcpy(p, &etat->LightModel, sizeof(etat->LightModel));
        glUnmapBuffer(GL_UNIFORM_BUFFER);
    }

    // Mode plein ou en fil
    glPolygonMode(GL_FRONT_AND_BACK, etat->state.modePolygone);
    if (etat->state.culling) glEnable(GL_CULL_FACE); else glDisable(GL_CULL_FACE);
    // erreur dans le constructeur
    glm::vec3 coords = glm::vec3(-1., 0., 4.);
    GLfloat rotation = 0.;
    glm::vec3 axis = glm::vec3(0., 0., 0.);
    GLfloat scale = 1.;

    /*
    Spaceship spaceship1 = Spaceship(coords, rotation , axis, scale);
    glVertexAttrib4f(locColor, 1., 0., 0., 0. );
     matrModel.PushMatrix(); {
         matrModel.Translate(coords);
         matrModel.Scale(scale);
         //matrModel.Rotate(rotation, axis);
         glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel);
         glUniformMatrix3fv(locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu.getMatr() * matrModel.getMatr()))));
         spaceship1.DrawBody();
    }matrModel.PopMatrix();
    */

    for (Shape* shape : scene->getShapes()) // access by reference to avoid copying
    {
        if (shape->appear)
        {	// *********************verifier pour afficher texture ****************//
            glVertexAttrib4f(locColor, shape->baseColor_.r, shape->baseColor_.b, shape->baseColor_.g, shape->baseColor_.a);
            matrModel.PushMatrix(); {
                matrModel.Translate(shape->coords_);
                matrModel.Scale(shape->scale_);
                matrModel.Rotate(shape->rotation_, shape->rotationAxis_);
                glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel);
                glUniformMatrix3fv(locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu.getMatr() * matrModel.getMatr()))));
                shape->Draw();
            }matrModel.PopMatrix();
        }
    }
}

void Fenetre::chargerNuanceurs(std::string path)
{
    const char * SHADER_NAME = "nuanceurs.glsl";
    // charger le nuanceur de base
    {
        std::string absoluteRef = path.append(SHADER_NAME);

        // cr�er le programme
        progBase = glCreateProgram();

        // attacher le nuanceur de sommets
        const GLchar *chainesSommets[2] = { "#version 410\n#define NUANCEUR_SOMMETS\n", ProgNuanceur::lireNuanceur(absoluteRef.data()) };
        if (chainesSommets[1] != NULL)
        {
            GLuint nuanceurObj = glCreateShader(GL_VERTEX_SHADER);
            glShaderSource(nuanceurObj, 2, chainesSommets, NULL);
            glCompileShader(nuanceurObj);
            glAttachShader(progBase, nuanceurObj);
            ProgNuanceur::afficherLogCompile(nuanceurObj);
            delete[] chainesSommets[1];
        }
        // attacher le nuanceur de fragments
        const GLchar *chainesFragments[2] = { "#version 410\n#define NUANCEUR_FRAGMENTS\n", ProgNuanceur::lireNuanceur(absoluteRef.data()) };
        if (chainesFragments[1] != NULL)
        {
            GLuint nuanceurObj = glCreateShader(GL_FRAGMENT_SHADER);
            glShaderSource(nuanceurObj, 2, chainesFragments, NULL);
            glCompileShader(nuanceurObj);
            glAttachShader(progBase, nuanceurObj);
            ProgNuanceur::afficherLogCompile(nuanceurObj);
            delete[] chainesFragments[1];
        }

        // faire l'�dition des liens du programme
        glLinkProgram(progBase);
        ProgNuanceur::afficherLogLink(progBase);

        // demander la "Location" des variables
        if ((locVertex = glGetAttribLocation(progBase, "Vertex")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de Vertex" << std::endl;
        if ((locNormal = glGetAttribLocation(progBase, "Normal")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de Normal (partie 1)" << std::endl;
        if ((locColor = glGetAttribLocation(progBase, "Color")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de Color" << std::endl;
        if ((locmatrModel = glGetUniformLocation(progBase, "matrModel")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de matrModel" << std::endl;
        if ((locmatrVisu = glGetUniformLocation(progBase, "matrVisu")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de matrVisu" << std::endl;
        if ((locmatrProj = glGetUniformLocation(progBase, "matrProj")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de matrProj" << std::endl;
        if ((locmatrNormale = glGetUniformLocation(progBase, "matrNormale")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de matrNormale (partie 1)" << std::endl;
        if ((locplanCoupe = glGetUniformLocation(progBase, "planCoupe")) == -1) std::cerr << "!!! pas trouv� la \"Location\" de planCoupe" << std::endl;
        if ((indLightSource = glGetUniformBlockIndex(progBase, "LightSourceParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouv� l'\"index\" de LightSource" << std::endl;
        if ((indFrontMaterial = glGetUniformBlockIndex(progBase, "MaterialParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouv� l'\"index\" de etat->FrontMaterial" << std::endl;
        if ((indLightModel = glGetUniformBlockIndex(progBase, "LightModelParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouv� l'\"index\" de LightModel" << std::endl;

        // charger les ubo
        {
            glBindBuffer(GL_UNIFORM_BUFFER, ubo[0]);
            glBufferData(GL_UNIFORM_BUFFER, sizeof(etat->LightSource), &etat->LightSource, GL_DYNAMIC_COPY);
            glBindBuffer(GL_UNIFORM_BUFFER, 0);
            const GLuint bindingIndex = 0;
            glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[0]);
            glUniformBlockBinding(progBase, indLightSource, bindingIndex);
        }
        {
            glBindBuffer(GL_UNIFORM_BUFFER, ubo[1]);
            glBufferData(GL_UNIFORM_BUFFER, sizeof(etat->FrontMaterial), &etat->FrontMaterial, GL_DYNAMIC_COPY);
            glBindBuffer(GL_UNIFORM_BUFFER, 0);
            const GLuint bindingIndex = 1;
            glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[1]);
            glUniformBlockBinding(progBase, indFrontMaterial, bindingIndex);
        }
        {
            glBindBuffer(GL_UNIFORM_BUFFER, ubo[2]);
            glBufferData(GL_UNIFORM_BUFFER, sizeof(etat->LightModel), &etat->LightModel, GL_DYNAMIC_COPY);
            glBindBuffer(GL_UNIFORM_BUFFER, 0);
            const GLuint bindingIndex = 2;
            glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[2]);
            glUniformBlockBinding(progBase, indLightModel, bindingIndex);
        }
    }
}

void Fenetre::chargerTextures()
{
    /*
    unsigned char *pixels;
    GLsizei largeur, hauteur;
    if ((pixels = ChargerImage("../images/echiquier.bmp", largeur, hauteur)) != NULL)
    {
        glGenTextures(1, &etat->state.textureId);
        glBindTexture(GL_TEXTURE_2D, etat->state.textureId);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, largeur, hauteur, 0, GL_RGBA, GL_UNSIGNED_BYTE, pixels);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glGenerateMipmap(GL_TEXTURE_2D);
        glBindTexture(GL_TEXTURE_2D, 0);
        delete[] pixels;
    }

    glActiveTexture(GL_TEXTURE1); // l'unit� de texture 1
    glBindTexture(GL_TEXTURE_2D, etat->state.textureId);
    */
}

void Fenetre::redimensionner(GLsizei w, GLsizei h)
{
    glViewport(0, 0, w, h);
}

void Fenetre::screenshot(const char * filename) {
    const short PIXEL_BYTE_SIZE = 3;
    const size_t ARRAY_SIZE = PIXEL_BYTE_SIZE * DEFAULT_24BIT_BMP_HEADER.biWidth * DEFAULT_24BIT_BMP_HEADER.biHeight;
    GLubyte* imageBytes = new GLubyte[ARRAY_SIZE];


    // center then find lower left corner of DEFAULT_HEADER w x h
    int adjustedX = std::fmax(0, (largeur_ / 2) - DEFAULT_24BIT_BMP_HEADER.biWidth / 2);
    int adjustedY = std::fmax(0, (hauteur_ / 2) - DEFAULT_24BIT_BMP_HEADER.biHeight / 2);

    glReadPixels(
        adjustedX, adjustedY,
        DEFAULT_24BIT_BMP_HEADER.biWidth, DEFAULT_24BIT_BMP_HEADER.biHeight,
        GL_RGB, GL_UNSIGNED_BYTE,
        imageBytes
    );

    uint64_t offset = 0;

    // glReadPixel reads lowest to highest row, left to right
    Image image(DEFAULT_24BIT_BMP_HEADER.biWidth, DEFAULT_24BIT_BMP_HEADER.biHeight);
    for (int32_t y = DEFAULT_24BIT_BMP_HEADER.biHeight; y > 0; --y)
    {
        for (int32_t x = 0; x < DEFAULT_24BIT_BMP_HEADER.biWidth; ++x)
        {
            Pixel pixel(imageBytes[offset], imageBytes[offset + 1], imageBytes[offset + 2]);
            image.setPixel(x, DEFAULT_24BIT_BMP_HEADER.biHeight - y, pixel);
            offset = offset + PIXEL_BYTE_SIZE;
        }
    }

    delete[] imageBytes;
    imageBytes = nullptr;

    ImageHeader header(DEFAULT_24BIT_BMP_HEADER);
    header.biClrUsed = (uint32_t)image.colorsUsed.size();
    ofstream bmpOutputFile;
    bmpOutputFile.open(filename, std::ios::out | std::ios::binary | std::ios::trunc);
    bmpOutputFile << DEFAULT_24BIT_BMP_HEADER;
    bmpOutputFile << image;
    bmpOutputFile.close();
}

void Fenetre::genererMultivue(const char * sortie)
{
    const std::string FILENAME(sortie);
    const std::string A_POV("_a");
    const std::string B_POV("_b");
    const std::string ORIGINAL("_ori.bmp");
    const std::string MODIFIED("_mod.bmp");

    afficherScene();
    screenshot((FILENAME + A_POV + ORIGINAL).data());
    swap();

    camera.randomTurn();
    afficherScene();
    screenshot((FILENAME + B_POV + ORIGINAL).data());
    swap();

    //modifier sc�ne
    scene->modify();

    afficherScene();
    screenshot((FILENAME + B_POV + MODIFIED).data());
    swap();

    camera.unturn();
    afficherScene();
    screenshot((FILENAME + A_POV + MODIFIED).data());
    swap();
}


void Fenetre::clavier(TP_touche touche)
{
    switch (touche)
    {
    case TP_ECHAP:
    case TP_q: // Quitter l'application
        quit();
        break;
    case TP_x: // Activer/d�sactiver l'affichage des axes
        etat->state.afficheAxes = !etat->state.afficheAxes;
        std::cout << "// Affichage des axes ? " << (etat->state.afficheAxes ? "OUI" : "NON") << std::endl;
        break;
    case TP_i: // R�initiliaser le point de vue
        camera.turn(camera.INITIAL_PHI, camera.INITIAL_THETA);
        camera.setDistance(camera.INITIAL_DISTANCE);
        break;
    case TP_g: // Permuter l'affichage en fil de fer ou plein
        etat->state.modePolygone = (etat->state.modePolygone == GL_FILL) ? GL_LINE : GL_FILL;
        break;
    case TP_c: // Permuter l'affichage des faces arri�res
        etat->state.culling = !etat->state.culling;
        break;
    case TP_SOULIGNE:
    case TP_MOINS: // Reculer la cam�ra
        camera.incrDistance(0.1);
        break;
    case TP_PLUS: // Avancer la cam�ra
        camera.incrDistance(-0.1);
        break;
    case TP_EGAL:
        if (camera.getDistance() > 1.0) camera.setDistance( -0.1);
        break;
    case TP_b: // Modifier
        scene->modify();
        break;
    case TP_h: // D�cr�menter la dimension de la boite
        etat->state.dimBoite -= 0.05;
        if (etat->state.dimBoite < 1.0) etat->state.dimBoite = 1.0;
        std::cout << " etat->state.dimBoite=" << etat->state.dimBoite << std::endl;
        break;
    default:
        std::cout << " touche inconnue : " << (char)touche << std::endl;
        imprimerTouches();
        break;
    }
}

void Fenetre::sourisClic(int button, int state, int x, int y)
{
    // button est un parmi { TP_BOUTON_GAUCHE, TP_BOUTON_MILIEU, TP_BOUTON_DROIT }
    // state  est un parmi { TP_PRESSE, DL_RELEASED }
    pressed = (state == TP_PRESSE);
    switch (button)
    {
    case TP_BOUTON_GAUCHE: // D�placer (modifier angles) la cam�ra
        sourisPosPrec.x = x;
        sourisPosPrec.y = y;
        break;
    }
}

void Fenetre::sourisMolette(int x, int y)
{
    camera.incrDistance(0.2 * -y);
    if (camera.getDistance() < 15.0) camera.setDistance(15.0);
    else if (camera.getDistance() > 70.0) camera.setDistance(70.0);
}

void Fenetre::sourisMouvement(int x, int y)
{
    if (pressed)
    {
        int dx = x - sourisPosPrec.x;
        int dy = y - sourisPosPrec.y;
        camera.incrAngles(-dy / 3.0, -dx / 3.0);
        sourisPosPrec.x = x;
        sourisPosPrec.y = y;
    }
}