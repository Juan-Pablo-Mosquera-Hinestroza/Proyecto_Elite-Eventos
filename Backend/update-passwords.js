require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Usuario } = require('./src/models');

async function updatePasswords() {
    try {
        console.log('🔄 Actualizando contraseñas...\n');

        // Usuarios con sus nuevas contraseñas
        const usuarios = [
            { email: 'admin@eliteventos.com', password: 'admin123' },
            { email: 'juan@example.com', password: 'password123' },
            { email: 'maria@example.com', password: 'password123' },
            { email: 'carlos@example.com', password: 'password123' }
        ];

        for (const userData of usuarios) {
            const usuario = await Usuario.findOne({ 
                where: { email: userData.email },
                attributes: { include: ['password'] }
            });

            if (usuario) {
                // Hashear contraseña manualmente
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                // Actualizar SIN trigger (usando update directo)
                await Usuario.update(
                    { password: hashedPassword },
                    { 
                        where: { email: userData.email },
                        individualHooks: false // Evitar el hook beforeUpdate
                    }
                );

                console.log(`✅ ${usuario.email} - Contraseña actualizada`);
                console.log(`   Password: ${userData.password}`);
            }
        }

        console.log('\n✅ Todas las contraseñas actualizadas correctamente');
        console.log('\n📋 Credenciales de prueba:');
        console.log('┌─────────────────────────────┬──────────────┐');
        console.log('│ Email                       │ Password     │');
        console.log('├─────────────────────────────┼──────────────┤');
        console.log('│ admin@eliteventos.com       │ admin123     │');
        console.log('│ juan@example.com            │ password123  │');
        console.log('│ maria@example.com           │ password123  │');
        console.log('│ carlos@example.com          │ password123  │');
        console.log('└─────────────────────────────┴──────────────┘');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al actualizar contraseñas:', error);
        process.exit(1);
    }
}

updatePasswords();
