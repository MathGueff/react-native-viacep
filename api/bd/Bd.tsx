import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function Banco() {
    if (dbInstance) return dbInstance;
    
    dbInstance = await SQLite.openDatabaseAsync("Fatec_V3");
    console.log('--- Conexão Única Estabelecida com Fatec_V3 ---');
    return dbInstance;
}

async function createTable(db: SQLite.SQLiteDatabase) {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIO(
                ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME_US VARCHAR(100),
                EMAIL_US VARCHAR(100),
                CEP_US VARCHAR(8),
                LOGRADOURO_US VARCHAR(100),
                BAIRRO_US VARCHAR(100),
                LOCALIDADE_US VARCHAR(100),
                UF_US VARCHAR(2),
                NUMERO_US VARCHAR(20),
                COMPLEMENTO_US VARCHAR(100)
            )
            `);

        console.log('Tabela USUARIO garantida!');
    } catch (error) {
        console.log('Erro ao criar tabela', error);
    }
}

async function inserirUsuario(db: SQLite.SQLiteDatabase, dados: any) {
    try {
        await db.runAsync(
            "INSERT INTO USUARIO(NOME_US, EMAIL_US, CEP_US, LOGRADOURO_US, BAIRRO_US, LOCALIDADE_US, UF_US, NUMERO_US, COMPLEMENTO_US) VALUES (?,?,?,?,?,?,?,?,?)",
            [dados.nome || '', dados.email || '', dados.cep || '', dados.logradouro || '', dados.bairro || '', dados.localidade || '', dados.uf || '', dados.numero || '', dados.complemento || '']
        )
        console.log('Usuário inserido com sucesso')
    } catch (error) {
        console.log('Erro ao cadastrar usuário', error)
    }
}

async function atualizarUsuario(db: SQLite.SQLiteDatabase, id: number, dados: any) {
    try {
        await db.runAsync(
            "UPDATE USUARIO SET NOME_US = ?, EMAIL_US = ?, CEP_US = ?, LOGRADOURO_US = ?, BAIRRO_US = ?, LOCALIDADE_US = ?, UF_US = ?, NUMERO_US = ?, COMPLEMENTO_US = ? WHERE ID_US = ?",
            [dados.nome || '', dados.email || '', dados.cep || '', dados.logradouro || '', dados.bairro || '', dados.localidade || '', dados.uf || '', dados.numero || '', dados.complemento || '', id]
        )
        console.log('Usuário atualizado com sucesso')
    } catch (error) {
        console.log('Erro ao atualizar usuário', error)
    }
}

async function selectUsuarios(db: SQLite.SQLiteDatabase) {
    try {
        const resultado = await db.getAllAsync("SELECT * FROM USUARIO", [])
        return resultado
    } catch (error) {
        console.log('Erro ao buscar usuários', error)
        return []
    }
}

async function selectUsuarioId(db: SQLite.SQLiteDatabase, id: number) {
    try {
        const resultado = await db.getFirstAsync("SELECT * FROM USUARIO WHERE ID_US = ?", [id])
        return resultado
    } catch (error) {
        console.log('Erro ao buscar usuário por ID', error)
    }
}

async function deletaUsuario(db: SQLite.SQLiteDatabase, id: number) {
    try {
        await db.runAsync("DELETE FROM USUARIO WHERE ID_US = ?", [id])
        console.log('Usuário removido com sucesso')
    } catch (error) {
        console.log('Erro ao remover usuário', error)
    }
}

async function deleteAll(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync("DELETE FROM USUARIO")
        console.log('Todos os usuários foram deletados')
    } catch (error) {
        console.log('Erro ao deletar todos os usuários', error)
    }
}

export {
    Banco,
    createTable,
    inserirUsuario,
    atualizarUsuario,
    selectUsuarios,
    selectUsuarioId,
    deletaUsuario,
    deleteAll
}
