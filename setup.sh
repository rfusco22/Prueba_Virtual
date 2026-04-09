#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}     Setup - Notas App${NC}"
echo -e "${BLUE}==================================${NC}\n"

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) instalado${NC}\n"

# Verificar MySQL
echo -e "${BLUE}Verificando MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}⚠ MySQL no se encuentra en el PATH${NC}"
    echo "Por favor, asegúrate de que MySQL está instalado y ejecutándose"
    echo "Puedes iniciar MySQL manualmente y continuar"
    read -p "¿Deseas continuar? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ MySQL encontrado${NC}\n"
fi

# Setup Backend
echo -e "${BLUE}=== Configurando Backend ===${NC}\n"

if [ -d "backend" ]; then
    cd backend
    
    echo -e "${BLUE}Instalando dependencias del backend...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}\n"
    else
        echo -e "${RED}❌ Error instalando dependencias del backend${NC}"
        exit 1
    fi
    
    cd ..
else
    echo -e "${RED}❌ Carpeta 'backend' no encontrada${NC}"
    exit 1
fi

# Setup Frontend
echo -e "${BLUE}=== Configurando Frontend ===${NC}\n"

if [ -d "Frontend" ]; then
    cd Frontend
    
    echo -e "${BLUE}Instalando dependencias del frontend...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}\n"
    else
        echo -e "${RED}❌ Error instalando dependencias del frontend${NC}"
        exit 1
    fi
    
    cd ..
else
    echo -e "${RED}❌ Carpeta 'Frontend' no encontrada${NC}"
    exit 1
fi

# Resumen
echo -e "${BLUE}==================================${NC}"
echo -e "${GREEN}✓ Setup completado exitosamente!${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${BLUE}Próximos pasos:${NC}\n"

echo "1. Inicia MySQL (si no está corriendo):"
echo -e "   ${GREEN}mysql -u root -p${NC}\n"

echo "2. En otra terminal, inicia el backend:"
echo -e "   ${GREEN}cd backend && npm run start:dev${NC}\n"

echo "3. En otra terminal, inicia el frontend:"
echo -e "   ${GREEN}cd Frontend && npm run dev${NC}\n"

echo "4. Abre tu navegador en:"
echo -e "   ${GREEN}http://localhost:5173${NC}\n"

echo -e "${BLUE}Para más información, consulta:${NC}"
echo -e "   ${GREEN}deploylocal.md${NC}\n"
