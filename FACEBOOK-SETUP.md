# 📱 Configuración de Actividades Automáticas de Facebook

## Casa de Avivamiento y Reino Cerete

Este documento explica cómo configurar la detección automática de nuevas actividades de Facebook (publicaciones, reels, fotos, etc.) en el sitio web.

---

## 🎯 **Funcionalidades Implementadas**

### ✅ **Detección Automática**
- **Nuevas publicaciones** se muestran automáticamente
- **Reels y videos** se detectan y categorizan
- **Fotos e imágenes** se muestran con vista previa
- **Estadísticas de engagement** (likes, comentarios, compartidos)
- **Actualización cada 5 minutos** automáticamente

### ✅ **Interfaz de Usuario**
- **Sección "Actividades Recientes"** en la página principal
- **Botón de actualización manual** para refrescar contenido
- **Indicador de última actualización**
- **Enlaces directos** a Facebook para ver publicaciones completas
- **Diseño responsive** para móviles y escritorio

---

## 🔧 **Configuración Paso a Paso**

### **Paso 1: Crear Aplicación de Facebook**

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Haz clic en **"Mis Apps"** → **"Crear App"**
3. Selecciona **"Empresa"** como tipo de aplicación
4. Completa la información:
   - **Nombre de la app**: "Casa de Avivamiento Web"
   - **Email de contacto**: luismarkministerio@gmail.com
   - **Propósito**: Integración web para mostrar contenido de Facebook

### **Paso 2: Configurar Permisos de Página**

1. En el panel de tu aplicación, ve a **"Productos"**
2. Agrega **"Facebook Login"** y **"Graph API"**
3. Ve a **"Graph API Explorer"** en las herramientas
4. Selecciona tu aplicación
5. En **"Permisos"**, agrega:
   - `pages_read_engagement`
   - `pages_show_list`
   - `public_profile`

### **Paso 3: Generar Access Token**

1. En Graph API Explorer:
   - **Aplicación**: Selecciona tu app
   - **Tipo de token**: Page Access Token
   - **Página**: Casa de Avivamiento y Reino Cerete
2. Haz clic en **"Generar Access Token"**
3. **Copia el token generado** (será una cadena larga)

### **Paso 4: Configurar en el Sitio Web**

#### **Opción A: Configuración Automática (Recomendada)**
1. Abre el sitio web
2. Ve a la sección **"Actividades Recientes"**
3. Verás instrucciones de configuración
4. Pega tu Access Token en el campo proporcionado
5. Haz clic en **"Configurar"**

#### **Opción B: Configuración Manual**
1. Abre el archivo `facebook-config.js`
2. Busca la línea: `accessToken: '',`
3. Pega tu token entre las comillas:
   ```javascript
   accessToken: 'TU_ACCESS_TOKEN_AQUI',
   ```
4. Guarda el archivo y recarga la página

---

## 🔄 **Funcionamiento Automático**

### **Actualización Automática**
- El sistema verifica nuevas actividades **cada 5 minutos**
- Se muestran hasta **10 publicaciones recientes**
- Las actividades se ordenan por **fecha más reciente**

### **Tipos de Contenido Detectado**
- 📝 **Publicaciones de texto**
- 📸 **Fotos e imágenes**
- 🎥 **Videos y reels**
- 📊 **Estadísticas de engagement**

### **Información Mostrada**
- **Tipo de actividad** (Publicación, Foto, Video/Reel)
- **Tiempo transcurrido** (hace X minutos/horas/días)
- **Contenido del mensaje** (primeras 150 caracteres)
- **Imagen de vista previa** (si aplica)
- **Estadísticas**: Likes, comentarios, compartidos
- **Enlace directo** a Facebook

---

## 🎨 **Personalización**

### **Modificar Configuración**
Edita el archivo `facebook-config.js` para cambiar:

```javascript
// Intervalo de actualización (en milisegundos)
refreshInterval: 300000, // 5 minutos

// Número máximo de publicaciones
maxPosts: 10,

// Longitud del texto mostrado
truncateLength: 150,
```

### **Estilos CSS**
Los estilos están en `styles.css` bajo la sección:
```css
/* Recent Facebook Activities */
```

---

## 🛠️ **Solución de Problemas**

### **Problema: No se muestran actividades**
**Soluciones:**
1. Verifica que el Access Token esté configurado correctamente
2. Asegúrate de que la página de Facebook sea pública
3. Revisa la consola del navegador para errores
4. Verifica que los permisos de la app estén activos

### **Problema: Token expirado**
**Soluciones:**
1. Los Page Access Tokens pueden expirar
2. Genera un nuevo token siguiendo los pasos anteriores
3. Actualiza la configuración con el nuevo token

### **Problema: Límites de API**
**Soluciones:**
1. Facebook tiene límites de solicitudes por hora
2. El sistema está configurado para respetar estos límites
3. Si es necesario, aumenta el intervalo de actualización

---

## 📋 **Lista de Verificación**

### **Antes de ir en vivo:**
- [ ] Aplicación de Facebook creada y configurada
- [ ] Permisos de página otorgados
- [ ] Access Token generado y configurado
- [ ] Sitio web probado con actividades reales
- [ ] Actualización automática funcionando
- [ ] Diseño responsive verificado

### **Mantenimiento regular:**
- [ ] Verificar que el Access Token siga activo
- [ ] Monitorear límites de API de Facebook
- [ ] Actualizar permisos si Facebook cambia políticas
- [ ] Revisar logs de errores periódicamente

---

## 📞 **Soporte**

### **Recursos Útiles**
- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- [Facebook App Review Process](https://developers.facebook.com/docs/app-review/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

### **Contacto Técnico**
Para soporte técnico con la integración:
- **Email**: luismarkministerio@gmail.com
- **Facebook**: Casa de Avivamiento y Reino Cerete

---

## 🔒 **Seguridad**

### **Mejores Prácticas**
- **Nunca compartas** tu Access Token públicamente
- **Usa HTTPS** en producción
- **Rota los tokens** periódicamente
- **Monitorea el uso** de la API

### **Almacenamiento Seguro**
- Los tokens se almacenan en `localStorage` del navegador
- Para producción, considera usar variables de entorno
- Implementa renovación automática de tokens si es posible

---

¡Tu sitio web ahora puede mostrar automáticamente todas las actividades recientes de Facebook de Casa de Avivamiento y Reino Cerete! 🎉
