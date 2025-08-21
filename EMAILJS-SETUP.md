# Configuración de EmailJS para Formulario de Contacto

## 🎯 Objetivo
Configurar EmailJS para que el formulario de contacto envíe emails automáticamente a `studiootaku6@gmail.com`.

## 📋 Pasos de Configuración

### 1. Crear Cuenta en EmailJS

1. Ve a [EmailJS.com](https://www.emailjs.com/)
2. Haz clic en "Sign Up" (Registrarse)
3. Crea una cuenta gratuita con tu email

### 2. Configurar Servicio de Email

1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona **Gmail** como proveedor
4. Sigue estos pasos:
   - **Service ID**: `default_service` (o el que prefieras)
   - **Gmail Account**: Usa `studiootaku6@gmail.com`
   - Autoriza el acceso a Gmail
5. Guarda el servicio

### 3. Crear Template de Email

1. Ve a "Email Templates" en el dashboard
2. Haz clic en "Create New Template"
3. Configura el template:

**Template ID**: `template_contact`

**Subject**: `Nuevo mensaje de contacto - Casa de Avivamiento`

**Content (HTML)**:
```html
<h2>Nuevo mensaje de contacto</h2>
<p><strong>Nombre:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Teléfono:</strong> {{phone}}</p>
<p><strong>Mensaje:</strong></p>
<div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #6c5ce7;">
    {{message}}
</div>
<hr>
<p><em>Este mensaje fue enviado desde el formulario de contacto de Casa de Avivamiento y Reino Cerete.</em></p>
```

**To Email**: `studiootaku6@gmail.com`

4. Guarda el template

### 4. Obtener Public Key

1. Ve a "Account" → "General" en el dashboard
2. Copia tu **Public Key**
3. Reemplaza `"YOUR_PUBLIC_KEY"` en el archivo `index.html` con tu clave real

### 5. Actualizar el Código

En el archivo `index.html`, busca esta línea:
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // This will be configured
```

Y reemplázala con:
```javascript
emailjs.init("TU_PUBLIC_KEY_REAL");
```

## 🔧 Configuración Alternativa (Sin EmailJS)

Si prefieres una solución más simple, puedes usar un enlace directo a email:

```html
<a href="mailto:studiootaku6@gmail.com?subject=Contacto desde Casa de Avivamiento&body=Nombre:%0D%0AEmail:%0D%0ATeléfono:%0D%0AMensaje:%0D%0A" class="btn btn-primary">
    <i class="fas fa-envelope"></i> Enviar Email
</a>
```

## 📧 Resultado Final

Una vez configurado, cuando alguien complete el formulario:

1. **Se enviará un email** automáticamente a `studiootaku6@gmail.com`
2. **Contendrá toda la información**: nombre, email, teléfono, mensaje
3. **Formato profesional** con el diseño del template
4. **Confirmación visual** al usuario de que se envió correctamente

## 🚨 Importante

- **Plan Gratuito**: EmailJS permite 200 emails gratis por mes
- **Límites**: Suficiente para un sitio web de iglesia
- **Seguridad**: Tu email está protegido y no se expone públicamente

## 🔍 Verificación

Para probar que funciona:
1. Completa el formulario en tu sitio web
2. Revisa tu email `studiootaku6@gmail.com`
3. Deberías recibir el mensaje en unos segundos

---

¡Una vez configurado, recibirás todos los mensajes de contacto directamente en tu email! 📧
