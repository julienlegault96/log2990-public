#pragma once

#include "Shape.h"
#include "inf2705-theiere.h"
class  Spaceship : public Shape
{
public:
	Spaceship(glm::vec3 coords/* GLuint texture*/, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
	void initSpaceship(glm::vec3 coords/* GLuint texture*/, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);		
	~Spaceship();		
	void changeTexture(GLuint texture);
    void DrawBody();
    void DrawWings();
    glm::vec3 coords_;
	GLfloat rotation_;
	glm::vec3 rotationAxis_;
	GLfloat scale_;
	GLuint texture_;

};

Spaceship::Spaceship(glm::vec3 coords/*GLuint texture */, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
{
	initSpaceship(coords /*texture*/, rotation, rotationAxis, scale);
}

GLint locVertex = -1;
GLuint vao[2] = {0,0};
GLuint vboAileSommets = 0;
GLuint vboTheiereSommets = 0;
GLuint vboTheiereConnec = 0;

void Spaceship::initSpaceship( glm::vec3 coords /*GLuint texture(*/, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
 {
	this->coords_ = coords;
	//this->texture_ = texture;
	this->rotation_ = rotation;
	this->rotationAxis_ = rotationAxis;
	this->scale_ = scale;
	
        // aile 
		glBindVertexArray( vao[0] );
		GLfloat sommetsAile[] = { 0.0, 0.0, 1.0, 0.0, -0.2, -0.5 };
   		glGenBuffers( 1, &vboAileSommets );
   		glBindBuffer( GL_ARRAY_BUFFER, vboAileSommets );
   		glBufferData( GL_ARRAY_BUFFER, sizeof(sommetsAile), sommetsAile, GL_STATIC_DRAW );
   		// faire le lien avec l'attribut du nuanceur de sommets
   		glVertexAttribPointer( locVertex, 2, GL_FLOAT, GL_FALSE, 0, 0 );
   		glEnableVertexAttribArray(locVertex);
		// Nacelle
		glBindVertexArray( vao[1] );
		glGenBuffers(1, &vboTheiereSommets);
		glBindBuffer(GL_ARRAY_BUFFER, vboTheiereSommets);
		glBufferData(GL_ARRAY_BUFFER, sizeof(gTheiereSommets),gTheiereSommets, GL_STATIC_DRAW);
		glVertexAttribPointer( locVertex, 3, GL_FLOAT, GL_FALSE, 0, 0 );
		glEnableVertexAttribArray(locVertex);
		glGenBuffers(1, &vboTheiereConnec);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, vboTheiereConnec);
		glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(gTheiereConnec), gTheiereConnec, GL_STATIC_DRAW);
	//	glBindVertexArray(0);
		
	
}
void Spaceship::DrawWings()
{
   glBindVertexArray( vao[0] );
   glDrawArrays( GL_TRIANGLE_FAN, 0, 6 );
   glBindVertexArray(0);
}

void Spaceship::DrawBody()
{    
	glBindVertexArray( vao[1] );
	glDrawElements(GL_TRIANGLES,sizeof(gTheiereSommets), GL_UNSIGNED_INT, 0 );
	glBindVertexArray(0);
}

// void Spaceship::changeTexture(GLuint texture) 
// {
// 	this->texture_ = texture;
// 	this->modified_ = true;
// }

  Spaceship::~Spaceship()
{
   glDeleteBuffers( 1, &vboAileSommets );
   glDeleteBuffers( 1, &vboTheiereSommets );
   glDeleteBuffers( 1, &vboTheiereConnec );
}

