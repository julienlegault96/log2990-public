// "#version 4xx\n#define NUANCEUR_...\n" doit être ajouté en préambule au chargement de chaque nuanceur
////////////////////////////////////////////////////////////////////////////////
#if defined(NUANCEUR_SOMMETS)

uniform mat4 matrModel;
uniform mat4 matrVisu;
uniform mat4 matrProj;
uniform mat4 matrTexture;
uniform float dtexcoo;

layout(location=0) in vec4 Vertex;
layout(location=3) in vec4 Color;
layout(location=8) in vec2 TexCoord;

out Attribs {
   vec4 couleurAvant, couleurArriere;
   vec2 texCoord;
   //vec4 pos;
} AttribsOut;

void main(void)
{
   // transformation standard du sommet (P * V * M * sommet)
   gl_Position = matrProj * matrVisu * matrModel * Vertex;

   // couleur du sommet
   AttribsOut.couleurAvant = Color;
   AttribsOut.couleurArriere = vec4( 1.0 - Color.rgb, Color.a );

   // couleurAvant = vec4(1.0, 1.0, 1.0, 1.0) - gl_Color;

   // AttribsOut.pos = matrVisu * matrModel * Vertex;
   // AttribsOut.couleurArriere = vec4( abs(AttribsOut.pos.x), 0.0, 0.0, 1.0 );
   // AttribsOut.couleurArriere = vec4( 0.0, abs(AttribsOut.pos.y), 0.0, 1.0 );
   // AttribsOut.couleurArriere = vec4( abs(AttribsOut.pos.x), abs(AttribsOut.pos.y), 0.0, 1.0 );

   // transmettre au nuanceur de fragments les coordonnées de texture reçues
   AttribsOut.texCoord = TexCoord.st;
   // ... en appliquant la matrice de texture
   //AttribsOut.texCoord = ( matrTexture * vec4(TexCoord.st,0.0,1.0) ).st;
   // ... en appliquant une translation
   //AttribsOut.texCoord = TexCoord.st + vec2( sin(dtexcoo/20.), 0.0 );
   // ... en appliquant une rotation
   //mat2 rotation = mat2( vec2( cos(dtexcoo/50.), sin(dtexcoo/50.)),
   //                      vec2(-sin(dtexcoo/50.), cos(dtexcoo/50.)) );
   //AttribsOut.texCoord = rotation * TexCoord.st;
   // multiplier espace de texture
   //AttribsOut.texCoord = 4.0 * TexCoord.st;
}

////////////////////////////////////////////////////////////////////////////////
#elif defined(NUANCEUR_FRAGMENTS)

uniform sampler2D laTextureAVendre;
uniform sampler2D laTextureEchiquier;
uniform int choix;

in Attribs {
   vec4 couleurAvant, couleurArriere;
   vec2 texCoord;
   //vec4 pos;
} AttribsIn;

out vec4 FragColor;

void main(void)
{
   // aller chercher la couleur du fragment dans la texture
   vec4 coul = gl_FrontFacing ? AttribsIn.couleurAvant : AttribsIn.couleurArriere;
   vec4 couleur0 = texture( laTextureAVendre, AttribsIn.texCoord );
   vec4 couleur1 = texture( laTextureEchiquier, AttribsIn.texCoord );

   // assigner la couleur au fragment
   if ( choix == 0 )      FragColor = couleur0;
   else if ( choix == 1 ) FragColor = couleur1;
   else if ( choix == 2 ) FragColor = 0.5 * ( couleur0 + couleur1 );
   else if ( choix == 3 ) FragColor = 0.5 * ( couleur0 + couleur1 ) * coul;
   else                   FragColor = coul;
}

#endif
