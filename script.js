/* ============================================================
   CAVDEV RPG
   CRÔNICAS DO SOL NEGRO
   PROTÓTIPO — SISTEMA DE EXPLORAÇÃO
   ============================================================ */

"use strict";

/* ============================================================
   RNG — REALIDADE COM SEED
   ============================================================ */

class SeedRandom {

    constructor(seed) {
        this.seed = seed >>> 0;
    }

    next() {
        this.seed += 0x6D2B79F5;

        let t = this.seed;

        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    int(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    pick(array) {
        return array[this.int(0, array.length - 1)];
    }

    chance(percent) {
        return this.next() * 100 < percent;
    }
}


/* ============================================================
   UTILIDADES
   ============================================================ */

const Utils = {

    uid(prefix = "id") {
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    money(value) {
        return `${Math.max(0, Math.floor(value))} ouro`;
    },

    percent(value, max) {
        return Math.round((value / max) * 100);
    },

    escape(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
};


/* ============================================================
   DADOS DO MUNDO
   ============================================================ */

const WorldData = {

    races: {
        humano: {
            name: "Humano",
            specialty: "Adaptabilidade",
            language: "Língua Comum",
            bonus: {
                vitality: 2,
                luck: 1
            }
        },

        elfo: {
            name: "Elfo",
            specialty: "Percepção",
            language: "Élfico",
            bonus: {
                speed: 3,
                intelligence: 2
            }
        },

        anao: {
            name: "Anão",
            specialty: "Forja",
            language: "Anão Antigo",
            bonus: {
                resistance: 4,
                strength: 2
            }
        },

        lizard: {
            name: "Lizard",
            specialty: "Sobrevivência",
            language: "Língua das Escamas",
            bonus: {
                resistance: 2,
                speed: 2
            }
        },

        druida: {
            name: "Druida",
            specialty: "Natureza",
            language: "Língua Verde",
            bonus: {
                intelligence: 3,
                vitality: 2
            }
        },

        mago: {
            name: "Mago",
            specialty: "Arcanismo",
            language: "Língua Arcana",
            bonus: {
                intelligence: 5
            }
        },

        lobisomem: {
            name: "Lobisomem",
            specialty: "Caça",
            language: "Língua Bestial",
            bonus: {
                strength: 4,
                speed: 2
            }
        },

        vampiro: {
            name: "Vampiro",
            specialty: "Sangue",
            language: "Língua Antiga",
            bonus: {
                intelligence: 3,
                luck: 2
            }
        }
    },

    tribes: {

        elfo: [
            "Elfos das Copas",
            "Elfos do Crepúsculo",
            "Elfos Exilados"
        ],

        anao: [
            "Clã da Forja",
            "Clã das Profundezas",
            "Clã Errante"
        ],

        lizard: [
            "Tribo das Raízes",
            "Tribo dos Pântanos",
            "Tribo das Escamas Negras"
        ],

        druida: [
            "Círculo Verde",
            "Círculo da Lua",
            "Círculo das Cinzas"
        ],

        mago: [
            "Escola Elemental",
            "Escola dos Véus",
            "Escola das Cinzas"
        ],

        lobisomem: [
            "Clã da Lua Partida",
            "Clã dos Uivadores",
            "Lobos Exilados"
        ],

        vampiro: [
            "Linhagem Carmesim",
            "Linhagem da Névoa",
            "Sangue Exilado"
        ]
    },

    cities: {

        cidade_dourada: {
            id: "cidade_dourada",
            name: "Cidade Dourada",
            icon: "🏰",
            description: "Grande centro comercial construído sobre antigas ruínas.",
            danger: 15,
            services: [
                "inn",
                "tavern",
                "blacksmith",
                "merchant",
                "guild"
            ]
        },

        fortaleza_ferro: {
            id: "fortaleza_ferro",
            name: "Fortaleza de Ferro",
            icon: "⚔️",
            description: "Uma cidade militar cercada por muralhas antigas.",
            danger: 25,
            services: [
                "inn",
                "blacksmith",
                "merchant",
                "guild"
            ]
        },

        aldeia_esquecida: {
            id: "aldeia_esquecida",
            name: "Aldeia Esquecida",
            icon: "🏚️",
            description: "Uma pequena comunidade quase apagada dos mapas.",
            danger: 35,
            services: [
                "inn",
                "tavern",
                "merchant"
            ]
        },

        mercado_negro: {
            id: "mercado_negro",
            name: "Mercado Negro",
            icon: "💀",
            description: "Um lugar onde quase tudo possui um preço.",
            danger: 60,
            services: [
                "tavern",
                "blacksmith",
                "merchant",
                "guild"
            ]
        }
    },

    regions: {

        floresta_ancestral: {
            id: "floresta_ancestral",
            name: "Floresta Ancestral",
            danger: 45,
            icon: "🌲"
        },

        pantano_escuro: {
            id: "pantano_escuro",
            name: "Pântano Escuro",
            danger: 65,
            icon: "🐊"
        },

        vale_sangue: {
            id: "vale_sangue",
            name: "Vale de Sangue",
            danger: 80,
            icon: "🩸"
        },

        ruinas_era_perdida: {
            id: "ruinas_era_perdida",
            name: "Ruínas da Era Perdida",
            danger: 90,
            icon: "⚙️"
        }
    },

    items: [

        {
            id: "espada_ferrugem",
            name: "Espada Enferrujada",
            type: "weapon",
            damage: 8,
            durability: 60,
            maxDurability: 60,
            price: 40,
            rarity: "comum"
        },

        {
            id: "machado_militar",
            name: "Machado Militar Antigo",
            type: "weapon",
            damage: 15,
            durability: 100,
            maxDurability: 100,
            price: 150,
            rarity: "incomum"
        },

        {
            id: "lamina_era_perdida",
            name: "Lâmina da Era Perdida",
            type: "weapon",
            damage: 35,
            durability: 180,
            maxDurability: 180,
            price: 800,
            rarity: "raro"
        },

        {
            id: "armadura_couro",
            name: "Armadura de Couro",
            type: "armor",
            defense: 5,
            durability: 80,
            maxDurability: 80,
            price: 100,
            rarity: "comum"
        },

        {
            id: "armadura_ferro",
            name: "Armadura de Ferro",
            type: "armor",
            defense: 15,
            durability: 130,
            maxDurability: 130,
            price: 350,
            rarity: "incomum"
        },

        {
            id: "armadura_ancestral",
            name: "Armadura Ancestral",
            type: "armor",
            defense: 30,
            durability: 220,
            maxDurability: 220,
            price: 1500,
            rarity: "raro"
        },

        {
            id: "amuleto_sol",
            name: "Amuleto do Sol Partido",
            type: "relic",
            intelligence: 4,
            luck: 4,
            price: 900,
            rarity: "raro"
        },

        {
            id: "fragmento_ancestral",
            name: "Fragmento da Máquina Ancestral",
            type: "relic",
            intelligence: 8,
            price: 2500,
            rarity: "lendario"
        }
    ],

    enemies: [

        {
            name: "Lobo Faminto",
            level: 2,
            hp: 35,
            damage: 6,
            xp: 20,
            gold: 8
        },

        {
            name: "Bandido da Estrada",
            level: 4,
            hp: 55,
            damage: 10,
            xp: 35,
            gold: 20
        },

        {
            name: "Servo Corrompido",
            level: 7,
            hp: 90,
            damage: 16,
            xp: 60,
            gold: 40
        },

        {
            name: "Guardião da Ruína",
            level: 12,
            hp: 150,
            damage: 25,
            xp: 110,
            gold: 80
        },

        {
            name: "Cavaleiro do Sol Negro",
            level: 20,
            hp: 250,
            damage: 40,
            xp: 250,
            gold: 180
        }
    ],

    lords: [

        {
            name: "Lord da Forja Corrompida",
            level: 10,
            hp: 300,
            damage: 30,
            fragment: "Fragmento da Forja"
        },

        {
            name: "Lord do Sangue Corrompido",
            level: 18,
            hp: 500,
            damage: 45,
            fragment: "Fragmento Carmesim"
        },

        {
            name: "Lord das Raízes Corrompidas",
            level: 25,
            hp: 750,
            damage: 60,
            fragment: "Fragmento Verde"
        },

        {
            name: "Lord dos Véus Corrompidos",
            level: 35,
            hp: 1000,
            damage: 80,
            fragment: "Fragmento dos Véus"
        },

        {
            name: "Lord do Vazio",
            level: 50,
            hp: 2000,
            damage: 120,
            fragment: "Fragmento do Vazio"
        }
    ]
};


/* ============================================================
   CAVDEV
   ============================================================ */

const CavDev = {

    rng: null,

    state: {

        reality: {
            seed: null,
            name: "Realidade sem nome"
        },

        player: null,

        inventory: [],

        equipment: {
            weapon: null,
            armor: null,
            relic: null
        },

        discovered: {
            regions: [],
            cities: [],
            manuscripts: [],
            enemies: [],
            lords: []
        },

        travel: {
            active: false,
            destination: null,
            progress: 0,
            distance: 0
        },

        combat: null,

        log: [],

        information: [],

        turn: 0
    },


    /* ========================================================
       NOVA REALIDADE
       ======================================================== */

    createReality() {

        const seed =
            Math.floor(Math.random() * 4294967295);

        this.rng = new SeedRandom(seed);

        const raceIds =
            Object.keys(WorldData.races);

        const race =
            this.rng.pick(raceIds);

        const regionIds =
            Object.keys(WorldData.regions);

        const region =
            this.rng.pick(regionIds);

        const raceData =
            WorldData.races[race];

        this.state.reality.seed = seed;

        this.state.reality.name =
            `Realidade #${String(seed).slice(-6)}`;

        this.state.player = {

            name: "O Desperto",

            race,

            raceName: raceData.name,

            tribe:
                WorldData.tribes[race]
                    ? this.rng.pick(WorldData.tribes[race])
                    : "Sem clã",

            level: 1,

            xp: 0,

            xpNext: 100,

            hp: 100,

            maxHp: 100,

            gold: 120,

            fatigue: 0,

            maxFatigue: 100,

            strength: 10,
            vitality: 10,
            speed: 10,
            intelligence: 10,
            luck: 10,
            resistance: 10,

            reputation: 0,

            kingAwareness: 0,

            blackSun: 0,

            currentLocation: {
                type: "wilderness",
                id: region
            },

            originRegion: region,

            language:
                raceData.language,

            alive: true
        };

        this.state.inventory = [];

        this.state.equipment = {
            weapon: null,
            armor: null,
            relic: null
        };

        this.state.discovered = {
            regions: [region],
            cities: [],
            manuscripts: [],
            enemies: [],
            lords: []
        };

        this.state.travel = {
            active: false,
            destination: null,
            progress: 0,
            distance: 0
        };

        this.state.combat = null;

        this.state.log = [];

        this.state.information = [];

        this.state.turn = 0;

        this.addLog(
            `🌑 Você desperta em uma realidade desconhecida.`
        );

        this.addLog(
            `📍 Região inicial: ${WorldData.regions[region].name}`
        );

        this.addLog(
            `🧬 Origem aparente: ${raceData.name}`
        );

        this.addLog(
            `🎲 Seed da realidade: ${seed}`
        );

        this.addLog(
            `❓ Você não sabe quem é.`
        );

        this.addLog(
            `🎯 Seu primeiro objetivo é sobreviver.`
        );

        this.giveItem(
            this.rng.pick([
                "espada_ferrugem",
                "armadura_couro"
            ])
        );

        this.render();
    },


    /* ========================================================
       LOG
       ======================================================== */

    addLog(message) {

        this.state.log.unshift({
            message,
            turn: this.state.turn
        });

        if (this.state.log.length > 80) {
            this.state.log.pop();
        }
    },


    /* ========================================================
       ITEM
       ======================================================== */

    getItemTemplate(id) {

        return WorldData.items.find(
            item => item.id === id
        );
    },


    cloneItem(template) {

        return {
            ...template,
            uid: Utils.uid("item")
        };
    },


    giveItem(id) {

        const template =
            this.getItemTemplate(id);

        if (!template) return;

        const item =
            this.cloneItem(template);

        this.state.inventory.push(item);

        this.addLog(
            `🎒 Você encontrou: ${item.name}.`
        );

        return item;
    },


    equipItem(uid) {

        const index =
            this.state.inventory.findIndex(
                item => item.uid === uid
            );

        if (index === -1) return;

        const item =
            this.state.inventory[index];

        if (
            item.type !== "weapon" &&
            item.type !== "armor" &&
            item.type !== "relic"
        ) {
            return;
        }

        const old =
            this.state.equipment[item.type];

        if (old) {
            this.state.inventory.push(old);
        }

        this.state.equipment[item.type] =
            item;

        this.state.inventory.splice(index, 1);

        this.addLog(
            `🛡️ Equipado: ${item.name}.`
        );

        this.render();
    },


    /* ========================================================
       COMPRA DE ITEM
       ======================================================== */

    buyItem(id) {

        const template =
            this.getItemTemplate(id);

        if (!template) return;

        const player =
            this.state.player;

        if (player.gold < template.price) {

            this.addLog(
                `❌ Ouro insuficiente para comprar ${template.name}.`
            );

            this.render();

            return;
        }

        player.gold -= template.price;

        this.state.inventory.push(
            this.cloneItem(template)
        );

        this.addLog(
            `🛒 Você comprou ${template.name} por ${template.price} ouro.`
        );

        this.render();
    },


    /* ========================================================
       VENDA
       ======================================================== */

    sellItem(uid) {

        const index =
            this.state.inventory.findIndex(
                item => item.uid === uid
            );

        if (index === -1) return;

        const item =
            this.state.inventory[index];

        const value =
            Math.max(1, Math.floor(item.price * 0.45));

        this.state.player.gold += value;

        this.state.inventory.splice(index, 1);

        this.addLog(
            `💰 Você vendeu ${item.name} por ${value} ouro.`
        );

        this.render();
    },


    /* ========================================================
       REPARO
       ======================================================== */

    repairEquipment() {

        const equipment =
            Object.values(this.state.equipment);

        let total = 0;

        equipment.forEach(item => {

            if (!item) return;

            if (
                item.durability === undefined ||
                item.maxDurability === undefined
            ) {
                return;
            }

            const missing =
                item.maxDurability -
                item.durability;

            total +=
                Math.ceil(missing * 0.5);
        });

        if (total <= 0) {

            this.addLog(
                "🔨 Seus equipamentos já estão reparados."
            );

            this.render();

            return;
        }

        if (this.state.player.gold < total) {

            this.addLog(
                `❌ Você precisa de ${total} ouro para reparar tudo.`
            );

            this.render();

            return;
        }

        this.state.player.gold -= total;

        equipment.forEach(item => {

            if (
                item &&
                item.durability !== undefined
            ) {
                item.durability =
                    item.maxDurability;
            }
        });

        this.addLog(
            `🔨 Ferreiro reparou seus equipamentos por ${total} ouro.`
        );

        this.render();
    },


    /* ========================================================
       FADIGA
       ======================================================== */

    fatigueModifier() {

        const fatigue =
            this.state.player.fatigue;

        if (fatigue <= 20) return 1;

        if (fatigue <= 40) return 0.95;

        if (fatigue <= 60) return 0.85;

        if (fatigue <= 80) return 0.70;

        return 0.50;
    },


    fatigueStatus() {

        const fatigue =
            this.state.player.fatigue;

        if (fatigue <= 20)
            return "Descansado";

        if (fatigue <= 40)
            return "Cansado";

        if (fatigue <= 60)
            return "Fatigado";

        if (fatigue <= 80)
            return "Exausto";

        return "Quase incapacitado";
    },


    addFatigue(value) {

        this.state.player.fatigue =
            Utils.clamp(
                this.state.player.fatigue + value,
                0,
                this.state.player.maxFatigue
            );
    },


    /* ========================================================
       DESCANSO
       ======================================================== */

    rest() {

        const location =
            this.state.player.currentLocation;

        if (location.type !== "city") {

            this.addLog(
                "🏕️ Você não encontrou um local seguro para descansar."
            );

            this.render();

            return;
        }

        const city =
            WorldData.cities[location.id];

        if (!city.services.includes("inn")) {

            this.addLog(
                "❌ Esta cidade não possui hospedaria."
            );

            this.render();

            return;
        }

        const cost = 25;

        if (this.state.player.gold < cost) {

            this.addLog(
                "❌ Você não possui ouro suficiente para pagar a hospedaria."
            );

            this.render();

            return;
        }

        this.state.player.gold -= cost;

        this.state.player.fatigue =
            Math.max(
                0,
                this.state.player.fatigue - 75
            );

        this.state.player.hp =
            this.state.player.maxHp;

        this.state.turn += 1;

        this.addLog(
            `🛏️ Você descansou na hospedaria.`
        );

        this.addLog(
            `❤️ Sua vida foi restaurada.`
        );

        this.addLog(
            `💤 Fadiga reduzida.`
        );

        this.render();
    },


    /* ========================================================
       TRABALHO
       ======================================================== */

    work() {

        if (
            this.state.player.currentLocation.type !==
            "city"
        ) {

            this.addLog(
                "🪓 Você precisa encontrar uma cidade para procurar trabalho."
            );

            this.render();

            return;
        }

        const reward =
            this.rng.int(20, 55);

        this.state.player.gold += reward;

        this.addFatigue(15);

        this.state.turn += 1;

        this.addLog(
            `🪙 Você trabalhou e ganhou ${reward} ouro.`
        );

        this.render();
    },


    /* ========================================================
       TAVERNA
       ======================================================== */

    buyInformation() {

        const location =
            this.state.player.currentLocation;

        if (location.type !== "city") {

            this.addLog(
                "🍺 Você precisa estar em uma cidade."
            );

            this.render();

            return;
        }

        const city =
            WorldData.cities[location.id];

        if (!city.services.includes("tavern")) {

            this.addLog(
                "🍺 Esta cidade não possui uma taverna."
            );

            this.render();

            return;
        }

        const cost = 30;

        if (this.state.player.gold < cost) {

            this.addLog(
                "❌ Você não possui ouro suficiente."
            );

            this.render();

            return;
        }

        this.state.player.gold -= cost;

        const rumors = [

            "Um viajante fala sobre uma máquina enterrada sob uma cidade destruída.",

            "Dizem que existe um rei cujo nome foi removido de todos os livros.",

            "Um mercador afirma ter visto um homem atravessar uma parede.",

            "Há uma região onde o céu permanece negro mesmo durante o dia.",

            "Alguns ferreiros dizem que armas antigas não foram feitas por mãos humanas.",

            "Um velho afirma que o Sol Negro apareceu antes de uma grande guerra.",

            "Há uma masmorra que muda de caminho quando alguém entra nela.",

            "Um grupo de soldados desapareceu próximo às Ruínas da Era Perdida."
        ];

        const rumor =
            this.rng.pick(rumors);

        this.state.information.push(rumor);

        this.state.player.kingAwareness +=
            this.rng.int(1, 3);

        this.state.player.blackSun +=
            this.rng.int(0, 2);

        this.addLog(
            `🍺 Informação comprada: "${rumor}"`
        );

        this.render();
    },


    /* ========================================================
       MAPA
       ======================================================== */

    travelToCity(cityId) {

        const city =
            WorldData.cities[cityId];

        if (!city) return;

        if (
            this.state.player.currentLocation.type ===
                "city" &&
            this.state.player.currentLocation.id ===
                cityId
        ) {

            this.addLog(
                "📍 Você já está nesta cidade."
            );

            this.render();

            return;
        }

        const distance =
            this.rng.int(3, 9);

        this.state.travel = {

            active: true,

            destination: cityId,

            progress: 0,

            distance
        };

        this.state.player.currentLocation = {

            type: "road",

            id: null
        };

        this.addLog(
            `🧭 Você partiu em direção a ${city.name}.`
        );

        this.addLog(
            `🛤️ Distância estimada: ${distance} etapas.`
        );

        this.render();
    },


    /* ========================================================
       AVANÇAR NA ESTRADA
       ======================================================== */

    travelStep() {

        if (!this.state.travel.active) {

            this.addLog(
                "🧭 Você não está viajando."
            );

            this.render();

            return;
        }

        this.state.travel.progress += 1;

        this.addFatigue(
            this.rng.int(5, 12)
        );

        this.state.turn += 1;

        const destination =
            WorldData.cities[
                this.state.travel.destination
            ];

        const currentRegion =
            WorldData.regions[
                this.state.player.originRegion
            ];

        const danger =
            currentRegion
                ? currentRegion.danger
                : 50;

        /* ATAQUE */

        const enemyChance =
            35 + Math.floor(danger * 0.4);

        if (this.rng.chance(enemyChance)) {

            this.spawnRoadEnemy();

            this.render();

            return;
        }

        /* EVENTO */

        if (this.rng.chance(30)) {

            this.randomRoadEvent();

            this.render();

            return;
        }

        /* CHEGADA */

        if (
            this.state.travel.progress >=
            this.state.travel.distance
        ) {

            this.arriveAtCity(
                destination.id
            );

            return;
        }

        this.addLog(
            `🛤️ Você avançou pela estrada. ${this.state.travel.progress}/${this.state.travel.distance}`
        );

        this.render();
    },


    /* ========================================================
       CHEGADA
       ======================================================== */

    arriveAtCity(cityId) {

        const city =
            WorldData.cities[cityId];

        this.state.travel.active = false;

        this.state.player.currentLocation = {

            type: "city",

            id: cityId
        };

        if (
            !this.state.discovered.cities.includes(cityId)
        ) {

            this.state.discovered.cities.push(cityId);

            this.addLog(
                `🗺️ Nova cidade descoberta: ${city.name}!`
            );
        }

        this.addLog(
            `${city.icon} Você chegou em ${city.name}.`
        );

        this.addLog(
            `🛡️ As estradas ficaram para trás.`
        );

        this.render();
    },


    /* ========================================================
       INIMIGO DA ESTRADA
       ======================================================== */

    spawnRoadEnemy() {

        const enemy =
            this.rng.pick(WorldData.enemies);

        const scaled = {

            ...enemy,

            hp:
                Math.floor(
                    enemy.hp *
                    (1 + this.state.player.level * 0.08)
                ),

            maxHp:
                Math.floor(
                    enemy.hp *
                    (1 + this.state.player.level * 0.08)
                ),

            damage:
                Math.floor(
                    enemy.damage *
                    (1 + this.state.player.level * 0.05)
                )
        };

        this.state.combat = {

            enemy: scaled,

            enemyHp: scaled.hp,

            active: true
        };

        this.addLog(
            `⚠️ EMBOSCADA! ${enemy.name} apareceu na estrada!`
        );
    },


    /* ========================================================
       COMBATE
       ======================================================== */

    attack() {

        if (!this.state.combat?.active) {

            this.addLog(
                "⚔️ Não existe inimigo para atacar."
            );

            this.render();

            return;
        }

        const player =
            this.state.player;

        const weapon =
            this.state.equipment.weapon;

        const weaponDamage =
            weapon?.damage || 2;

        let damage =
            player.strength +
            weaponDamage;

        damage =
            Math.floor(
                damage *
                this.fatigueModifier()
            );

        damage = Math.max(1, damage);

        this.state.combat.enemyHp -= damage;

        this.addLog(
            `⚔️ Você causou ${damage} de dano.`
        );

        if (
            this.state.combat.enemyHp <= 0
        ) {

            this.winCombat();

            return;
        }

        this.enemyAttack();

        this.render();
    },


    enemyAttack() {

        const enemy =
            this.state.combat.enemy;

        let damage =
            enemy.damage -
            Math.floor(
                this.state.player.resistance * 0.25
            );

        damage =
            Math.max(1, damage);

        this.state.player.hp -= damage;

        this.addLog(
            `💥 ${enemy.name} causou ${damage} de dano.`
        );

        if (
            this.state.player.hp <= 0
        ) {

            this.playerDeath();
        }
    },


    winCombat() {

        const enemy =
            this.state.combat.enemy;

        const xp =
            enemy.xp;

        const gold =
            enemy.gold;

        this.state.player.xp += xp;

        this.state.player.gold += gold;

        this.addLog(
            `🏆 ${enemy.name} foi derrotado.`
        );

        this.addLog(
            `✨ +${xp} XP`
        );

        this.addLog(
            `🪙 +${gold} ouro`
        );

        if (
            !this.state.discovered.enemies
                .includes(enemy.name)
        ) {

            this.state.discovered.enemies.push(
                enemy.name
            );
        }

        this.state.combat = null;

        this.checkLevelUp();

        this.render();
    },


    playerDeath() {

        this.state.player.alive = false;

        this.addLog(
            "☠️ Você morreu."
        );

        this.addLog(
            "🌑 A realidade continua existindo sem você."
        );

        this.render();
    },


    /* ========================================================
       LEVEL UP
       ======================================================== */

    checkLevelUp() {

        const player =
            this.state.player;

        if (player.xp < player.xpNext) {
            return;
        }

        player.xp -= player.xpNext;

        player.level += 1;

        player.xpNext =
            Math.floor(
                player.xpNext * 1.35
            );

        player.maxHp += 15;

        player.hp =
            player.maxHp;

        player.strength += 2;
        player.vitality += 2;
        player.speed += 1;
        player.intelligence += 1;
        player.luck += 1;
        player.resistance += 1;

        this.addLog(
            `⬆️ Você alcançou o nível ${player.level}!`
        );

        this.addLog(
            "🧬 Seus atributos aumentaram."
        );
    },


    /* ========================================================
       EVENTOS DA ESTRADA
       ======================================================== */

    randomRoadEvent() {

        const events = [

            () => {

                const gold =
                    this.rng.int(10, 50);

                this.state.player.gold += gold;

                this.addLog(
                    `🪙 Você encontrou uma pequena bolsa com ${gold} ouro.`
                );
            },

            () => {

                this.state.player.kingAwareness += 1;

                this.addLog(
                    "👁️ Você encontrou pegadas estranhas que terminam no nada."
                );
            },

            () => {

                this.addFatigue(8);

                this.addLog(
                    "🧑‍🦽 Um viajante ferido pede ajuda."
                );

                this.addLog(
                    "Você decide continuar sua jornada."
                );
            },

            () => {

                this.state.player.blackSun += 2;

                this.addLog(
                    "🌑 Por alguns segundos o céu ficou completamente negro."
                );
            },

            () => {

                this.state.player.kingAwareness += 2;

                this.state.discovered.manuscripts.push(
                    "Manuscrito fragmentado sobre um rei sem nome"
                );

                this.addLog(
                    "📜 Você encontrou um manuscrito parcialmente destruído."
                );
            },

            () => {

                this.addLog(
                    "⚰️ Você encontrou uma sepultura sem nome."
                );

                if (
                    this.rng.chance(50)
                ) {

                    this.giveItem(
                        "amuleto_sol"
                    );
                }
            }
        ];

        this.rng.pick(events)();
    },


    /* ========================================================
       BUSCA
       ======================================================== */

    search() {

        if (
            this.state.player.currentLocation.type ===
            "city"
        ) {

            this.addLog(
                "🔎 Não há muito para procurar dentro da cidade."
            );

            this.render();

            return;
        }

        this.addFatigue(
            this.rng.int(5, 10)
        );

        this.state.turn += 1;

        const roll =
            this.rng.int(1, 100);

        if (roll <= 25) {

            this.addLog(
                "🔎 Você encontrou apenas pegadas antigas."
            );

        } else if (roll <= 50) {

            this.addLog(
                "🔎 Você encontrou restos de um acampamento."
            );

            this.state.player.kingAwareness += 1;

        } else if (roll <= 70) {

            const gold =
                this.rng.int(5, 35);

            this.state.player.gold += gold;

            this.addLog(
                `🔎 Você encontrou ${gold} ouro escondido.`
            );

        } else if (roll <= 88) {

            const item =
                this.rng.pick([
                    "espada_ferrugem",
                    "armadura_couro",
                    "amuleto_sol"
                ]);

            this.giveItem(item);

        } else {

            this.addLog(
                "⚠️ Sua busca revelou uma passagem escondida."
            );

            this.state.player.kingAwareness += 3;

            this.state.player.blackSun += 2;
        }

        this.render();
    },


    /* ========================================================
       LORD
       ======================================================== */

    encounterLord() {

        const lord =
            this.rng.pick(
                WorldData.lords
            );

        this.state.combat = {

            enemy: {

                ...lord,

                xp: lord.level * 30,

                gold: lord.level * 15
            },

            enemyHp: lord.hp,

            active: true,

            lord: true
        };

        this.addLog(
            `👑 Um Lord Corrompido apareceu: ${lord.name}!`
        );

        this.render();
    },


    /* ========================================================
       MÁQUINA ANCESTRAL
       ======================================================== */

    activateAncientMachine() {

        this.state.player.blackSun += 10;

        this.state.player.kingAwareness += 10;

        this.addLog(
            "⚙️ A Máquina Ancestral foi ativada."
        );

        this.addLog(
            "🌑 O céu respondeu."
        );

        this.addLog(
            "👑 Algo antigo despertou."
        );

        this.render();
    },


    /* ========================================================
       IDENTIDADE
       ======================================================== */

    identityProgress() {

        const value =
            this.state.player.kingAwareness;

        if (value < 5)
            return "Você sente apenas estranheza.";

        if (value < 10)
            return "Algumas coisas parecem familiares.";

        if (value < 20)
            return "Você começa a reconhecer símbolos antigos.";

        if (value < 30)
            return "Seus sonhos mostram um trono vazio.";

        if (value < 45)
            return "Você vê memórias que não parecem suas.";

        return "O passado está tentando lembrar de você.";
    },


    /* ========================================================
       RESET
       ======================================================== */

    newRun() {

        this.createReality();
    },


    /* ========================================================
       SERVIÇOS DA CIDADE
       ======================================================== */

    openCityService(service) {

        const location =
            this.state.player.currentLocation;

        if (location.type !== "city") {

            this.addLog(
                "🏙️ Você precisa estar em uma cidade."
            );

            this.render();

            return;
        }

        const city =
            WorldData.cities[location.id];

        if (
            !city.services.includes(service)
        ) {

            this.addLog(
                "❌ Este serviço não existe nesta cidade."
            );

            this.render();

            return;
        }

        if (service === "inn") {

            this.rest();

            return;
        }

        if (service === "tavern") {

            this.buyInformation();

            return;
        }

        if (service === "blacksmith") {

            this.repairEquipment();

            return;
        }

        if (service === "merchant") {

            this.addLog(
                "🛒 O mercador abriu sua banca."
            );

            this.render();

            return;
        }

        if (service === "guild") {

            this.addLog(
                "⚔️ O mestre da guilda oferece missões."
            );

            this.render();

            return;
        }
    },


    /* ========================================================
       MAPA DE CIDADES
       ======================================================== */

    getCityButtons() {

        return Object.values(WorldData.cities)
            .map(city => {

                const discovered =
                    this.state.discovered.cities
                        .includes(city.id);

                return `
                    <button
                        class="city-button"
                        onclick="CavDev.travelToCity('${city.id}')"
                    >
                        <span class="city-icon">
                            ${city.icon}
                        </span>

                        <span>
                            <strong>
                                ${city.name}
                            </strong>

                            <small>
                                Perigo ${city.danger}%
                            </small>
                        </span>
                    </button>
                `;
            })
            .join("");
    },


    /* ========================================================
       INVENTÁRIO
       ======================================================== */

    renderInventory() {

        if (
            this.state.inventory.length === 0
        ) {

            return `
                <div class="empty">
                    Inventário vazio
                </div>
            `;
        }

        return this.state.inventory
            .map(item => `

                <div class="inventory-item">

                    <div class="item-icon">
                        ${this.itemIcon(item)}
                    </div>

                    <div class="item-info">

                        <strong>
                            ${item.name}
                        </strong>

                        <small>
                            ${item.rarity}
                        </small>

                        ${
                            item.damage
                                ? `<span>⚔️ Dano ${item.damage}</span>`
                                : ""
                        }

                        ${
                            item.defense
                                ? `<span>🛡️ Defesa ${item.defense}</span>`
                                : ""
                        }

                        ${
                            item.durability !== undefined
                                ? `
                                    <span>
                                        🔧 ${item.durability}/${item.maxDurability}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                    <div class="item-actions">

                        <button
                            onclick="CavDev.equipItem('${item.uid}')"
                        >
                            Equipar
                        </button>

                        <button
                            onclick="CavDev.sellItem('${item.uid}')"
                        >
                            Vender
                        </button>

                    </div>

                </div>
            `)
            .join("");
    },


    itemIcon(item) {

        if (item.type === "weapon")
            return "⚔️";

        if (item.type === "armor")
            return "🛡️";

        if (item.type === "relic")
            return "💎";

        return "📦";
    },


    /* ========================================================
       EQUIPAMENTOS
       ======================================================== */

    renderEquipment() {

        const slots = {

            weapon: "⚔️ Arma",

            armor: "🛡️ Armadura",

            relic: "💎 Relíquia"
        };

        return Object.entries(slots)
            .map(([slot, label]) => {

                const item =
                    this.state.equipment[slot];

                return `

                    <div class="equipment-slot">

                        <span>
                            ${label}
                        </span>

                        <strong>
                            ${
                                item
                                    ? item.name
                                    : "Vazio"
                            }
                        </strong>

                        ${
                            item?.damage
                                ? `<small>⚔️ ${item.damage} dano</small>`
                                : ""
                        }

                        ${
                            item?.defense
                                ? `<small>🛡️ ${item.defense} defesa</small>`
                                : ""
                        }

                        ${
                            item?.durability !== undefined
                                ? `
                                    <small>
                                        🔧
                                        ${item.durability}/${item.maxDurability}
                                    </small>
                                  `
                                : ""
                        }

                    </div>
                `;
            })
            .join("");
    },


    /* ========================================================
       LOJA
       ======================================================== */

    renderShop() {

        return WorldData.items
            .map(item => `

                <div class="shop-item">

                    <span>
                        ${this.itemIcon(item)}
                    </span>

                    <div>

                        <strong>
                            ${item.name}
                        </strong>

                        <small>
                            ${item.rarity}
                        </small>

                    </div>

                    <button
                        onclick="CavDev.buyItem('${item.id}')"
                    >
                        ${item.price} 🪙
                    </button>

                </div>

            `)
            .join("");
    },


    /* ========================================================
       STATUS
       ======================================================== */

    renderStats() {

        const p =
            this.state.player;

        const weapon =
            this.state.equipment.weapon;

        const armor =
            this.state.equipment.armor;

        const damage =
            p.strength +
            (weapon?.damage || 0);

        const defense =
            p.resistance +
            (armor?.defense || 0);

        return `

            <div class="stat-row">
                <span>⚔️ Força</span>
                <strong>${p.strength}</strong>
            </div>

            <div class="stat-row">
                <span>❤️ Vitalidade</span>
                <strong>${p.vitality}</strong>
            </div>

            <div class="stat-row">
                <span>💨 Velocidade</span>
                <strong>${p.speed}</strong>
            </div>

            <div class="stat-row">
                <span>🧠 Inteligência</span>
                <strong>${p.intelligence}</strong>
            </div>

            <div class="stat-row">
                <span>🍀 Sorte</span>
                <strong>${p.luck}</strong>
            </div>

            <div class="stat-row">
                <span>🛡️ Resistência</span>
                <strong>${p.resistance}</strong>
            </div>

            <hr>

            <div class="stat-row">
                <span>⚔️ Dano total</span>
                <strong>${damage}</strong>
            </div>

            <div class="stat-row">
                <span>🛡️ Defesa total</span>
                <strong>${defense}</strong>
            </div>
        `;
    },


    /* ========================================================
       HUD
       ======================================================== */

    renderHUD() {

        const p =
            this.state.player;

        const hp =
            Utils.percent(
                p.hp,
                p.maxHp
            );

        const xp =
            Utils.percent(
                p.xp,
                p.xpNext
            );

        const fatigue =
            Utils.percent(
                p.fatigue,
                p.maxFatigue
            );

        return `

            <section class="hero-hud">

                <div class="hero-main">

                    <div class="avatar">
                        🧑‍🚀
                    </div>

                    <div>

                        <h2>
                            ${p.name}
                        </h2>

                        <span>
                            ${p.raceName}
                            • ${p.tribe}
                        </span>

                        <small>
                            ${this.identityProgress()}
                        </small>

                    </div>

                </div>


                <div class="bars">

                    <div class="bar-box">

                        <div>
                            ❤️ Vida
                            <span>
                                ${p.hp}/${p.maxHp}
                            </span>
                        </div>

                        <div class="bar">
                            <i
                                style="width:${hp}%"
                            ></i>
                        </div>

                    </div>


                    <div class="bar-box">

                        <div>
                            ✨ XP
                            <span>
                                ${p.xp}/${p.xpNext}
                            </span>
                        </div>

                        <div class="bar xp">
                            <i
                                style="width:${xp}%"
                            ></i>
                        </div>

                    </div>


                    <div class="bar-box">

                        <div>
                            💤 Fadiga
                            <span>
                                ${this.fatigueStatus()}
                            </span>
                        </div>

                        <div class="bar fatigue">
                            <i
                                style="width:${fatigue}%"
                            ></i>
                        </div>

                    </div>

                </div>


                <div class="quick-values">

                    <div>
                        <span>LVL</span>
                        <strong>${p.level}</strong>
                    </div>

                    <div>
                        <span>🪙</span>
                        <strong>${p.gold}</strong>
                    </div>

                    <div>
                        <span>☠️</span>
                        <strong>${p.reputation}</strong>
                    </div>

                    <div>
                        <span>🌑</span>
                        <strong>${p.blackSun}</strong>
                    </div>

                </div>

            </section>
        `;
    },


    /* ========================================================
       LOCALIZAÇÃO
       ======================================================== */

    renderLocation() {

        const location =
            this.state.player.currentLocation;

        if (location.type === "city") {

            const city =
                WorldData.cities[location.id];

            return `

                <div class="location-card city-location">

                    <span class="big-icon">
                        ${city.icon}
                    </span>

                    <div>

                        <small>
                            LOCALIZAÇÃO
                        </small>

                        <h3>
                            ${city.name}
                        </h3>

                        <p>
                            ${city.description}
                        </p>

                    </div>

                </div>
            `;
        }

        if (location.type === "road") {

            const destination =
                WorldData.cities[
                    this.state.travel.destination
                ];

            return `

                <div class="location-card road-location">

                    <span class="big-icon">
                        🛤️
                    </span>

                    <div>

                        <small>
                            EM VIAGEM
                        </small>

                        <h3>
                            Estrada
                        </h3>

                        <p>
                            Destino:
                            ${destination?.name || "desconhecido"}
                        </p>

                        <div class="travel-progress">

                            <span
                                style="
                                width:${
                                    (
                                        this.state.travel.progress /
                                        this.state.travel.distance
                                    ) * 100
                                }%"
                            ></span>

                        </div>

                        <small>
                            ${
                                this.state.travel.progress
                            }
                            /
                            ${
                                this.state.travel.distance
                            }
                        </small>

                    </div>

                </div>
            `;
        }

        const region =
            WorldData.regions[
                location.id
            ];

        return `

            <div class="location-card wilderness-location">

                <span class="big-icon">
                    ${region?.icon || "🌲"}
                </span>

                <div>

                    <small>
                        REGIÃO
                    </small>

                    <h3>
                        ${region?.name || "Terras Desconhecidas"}
                    </h3>

                    <p>
                        Perigo:
                        ${region?.danger || 50}%
                    </p>

                </div>

            </div>
        `;
    },


    /* ========================================================
       COMBATE UI
       ======================================================== */

    renderCombat() {

        if (
            !this.state.combat?.active
        ) {

            return "";
        }

        const combat =
            this.state.combat;

        const enemy =
            combat.enemy;

        const percent =
            Utils.percent(
                combat.enemyHp,
                enemy.hp
            );

        return `

            <section class="combat-panel">

                <div class="combat-title">
                    ⚔️ COMBATE
                </div>

                <div class="enemy">

                    <div class="enemy-avatar">
                        ${
                            combat.lord
                                ? "👑"
                                : "👹"
                        }
                    </div>

                    <div>

                        <h3>
                            ${enemy.name}
                        </h3>

                        <span>
                            Nível ${enemy.level}
                        </span>

                        <div class="bar">

                            <i
                                style="
                                width:${percent}%
                                "
                            ></i>

                        </div>

                        <small>
                            ${combat.enemyHp}/${enemy.hp} HP
                        </small>

                    </div>

                </div>

                <button
                    class="attack-button"
                    onclick="CavDev.attack()"
                >
                    ⚔️ ATACAR
                </button>

            </section>
        `;
    },


    /* ========================================================
       AÇÕES
       ======================================================== */

    renderActions() {

        const location =
            this.state.player.currentLocation;

        if (
            this.state.combat?.active
        ) {
            return "";
        }

        if (location.type === "city") {

            const city =
                WorldData.cities[location.id];

            return `

                <div class="action-grid">

                    ${
                        city.services.includes("inn")
                            ? `
                                <button
                                    onclick="CavDev.rest()"
                                >
                                    🛏️
                                    <span>Hospedaria</span>
                                </button>
                              `
                            : ""
                    }

                    ${
                        city.services.includes("tavern")
                            ? `
                                <button
                                    onclick="CavDev.buyInformation()"
                                >
                                    🍺
                                    <span>Taverna</span>
                                </button>
                              `
                            : ""
                    }

                    ${
                        city.services.includes("blacksmith")
                            ? `
                                <button
                                    onclick="CavDev.repairEquipment()"
                                >
                                    🔨
                                    <span>Ferreiro</span>
                                </button>
                              `
                            : ""
                    }

                    ${
                        city.services.includes("merchant")
                            ? `
                                <button
                                    onclick="CavDev.buyItem('machado_militar')"
                                >
                                    🛒
                                    <span>Mercador</span>
                                </button>
                              `
                            : ""
                    }

                    <button
                        onclick="CavDev.work()"
                    >
                        🪙
                        <span>Trabalhar</span>
                    </button>

                    <button
                        onclick="CavDev.travelToCity('fortaleza_ferro')"
                    >
                        🗺️
                        <span>Mapa</span>
                    </button>

                </div>
            `;
        }

        if (location.type === "road") {

            return `

                <div class="action-grid">

                    <button
                        onclick="CavDev.travelStep()"
                    >
                        🛤️
                        <span>Avançar</span>
                    </button>

                    <button
                        onclick="CavDev.search()"
                    >
                        🔎
                        <span>Procurar</span>
                    </button>

                    <button
                        onclick="CavDev.randomRoadEvent()"
                    >
                        🎲
                        <span>Investigar</span>
                    </button>

                </div>
            `;
        }

        return `

            <div class="action-grid">

                <button
                    onclick="CavDev.search()"
                >
                    🔎
                    <span>Explorar</span>
                </button>

                <button
                    onclick="CavDev.travelToCity('cidade_dourada')"
                >
                    🏰
                    <span>Ir para Cidade</span>
                </button>

                <button
                    onclick="CavDev.encounterLord()"
                >
                    👑
                    <span>Desafiar Lord</span>
                </button>

                <button
                    onclick="CavDev.activateAncientMachine()"
                >
                    ⚙️
                    <span>Máquina Ancestral</span>
                </button>

            </div>
        `;
    },


    /* ========================================================
       DIÁRIO
       ======================================================== */

    renderLog() {

        return this.state.log
            .slice(0, 18)
            .map(entry => `

                <div class="log-entry">

                    <span>
                        [${entry.turn}]
                    </span>

                    ${entry.message}

                </div>

            `)
            .join("");
    },


    /* ========================================================
       INFORMAÇÕES
       ======================================================== */

    renderInformation() {

        if (
            this.state.information.length === 0
        ) {

            return `
                <div class="empty">
                    Nenhuma informação registrada.
                </div>
            `;
        }

        return this.state.information
            .slice()
            .reverse()
            .map(info => `

                <div class="rumor">

                    <span>📜</span>

                    <p>
                        ${info}
                    </p>

                </div>

            `)
            .join("");
    },


    /* ========================================================
       MAPA
       ======================================================== */

    renderMap() {

        return `

            <div class="map-world">

                <div class="map-title">
                    🗺️ MAPA DAS TERRAS MÉDIAS
                </div>

                <div class="map-line">

                    <button
                        onclick="CavDev.travelToCity('aldeia_esquecida')"
                    >
                        🏚️
                        <span>
                            Aldeia
                        </span>
                    </button>

                    <div class="route"></div>

                    <button
                        onclick="CavDev.travelToCity('cidade_dourada')"
                    >
                        🏰
                        <span>
                            Cidade Dourada
                        </span>
                    </button>

                    <div class="route"></div>

                    <button
                        onclick="CavDev.travelToCity('fortaleza_ferro')"
                    >
                        ⚔️
                        <span>
                            Fortaleza
                        </span>
                    </button>

                    <div class="route"></div>

                    <button
                        onclick="CavDev.travelToCity('mercado_negro')"
                    >
                        💀
                        <span>
                            Mercado Negro
                        </span>
                    </button>

                </div>

                <div class="map-warning">

                    ⚠️
                    As estradas entre cidades são perigosas.
                    Quanto maior o perigo da região,
                    maior a chance de encontros hostis.

                </div>

            </div>
        `;
    },


    /* ========================================================
       RENDER PRINCIPAL
       ======================================================== */

    render() {

        const root =
            document.getElementById(
                "cavdev-rpg"
            );

        if (!root) return;

        root.innerHTML = `

            <div class="game-shell">

                ${this.renderHUD()}


                <div class="dashboard">


                    <!-- COLUNA ESQUERDA -->

                    <aside class="left-column">

                        ${this.renderLocation()}

                        <section class="panel">

                            <div class="panel-title">
                                📊 ATRIBUTOS
                            </div>

                            ${this.renderStats()}

                        </section>


                        <section class="panel">

                            <div class="panel-title">
                                🛡️ EQUIPAMENTO
                            </div>

                            ${this.renderEquipment()}

                        </section>

                    </aside>


                    <!-- CENTRO -->

                    <main class="center-column">

                        ${this.renderCombat()}


                        <section class="panel action-panel">

                            <div class="panel-title">
                                🎮 AÇÕES
                            </div>

                            ${this.renderActions()}

                        </section>


                        ${this.renderMap()}


                        <section class="panel">

                            <div class="panel-title">
                                🎒 INVENTÁRIO
                            </div>

                            <div class="inventory-list">

                                ${this.renderInventory()}

                            </div>

                        </section>

                    </main>


                    <!-- DIREITA -->

                    <aside class="right-column">

                        <section class="panel">

                            <div class="panel-title">
                                🛒 MERCADOR
                            </div>

                            <div class="shop-list">

                                ${this.renderShop()}

                            </div>

                        </section>


                        <section class="panel">

                            <div class="panel-title">
                                📜 LIVRO DA TRAJETÓRIA
                            </div>

                            <div class="trajectory">

                                <p>
                                    Realidade:
                                    <strong>
                                        ${this.state.reality.name}
                                    </strong>
                                </p>

                                <p>
                                    Seed:
                                    <strong>
                                        ${this.state.reality.seed}
                                    </strong>
                                </p>

                                <p>
                                    Descobertas:
                                    <strong>
                                        ${this.state.discovered.manuscripts.length}
                                    </strong>
                                </p>

                                <p>
                                    Cidades:
                                    <strong>
                                        ${this.state.discovered.cities.length}
                                    </strong>
                                </p>

                                <p>
                                    Inimigos conhecidos:
                                    <strong>
                                        ${this.state.discovered.enemies.length}
                                    </strong>
                                </p>

                                <p>
                                    Percepção do passado:
                                    <strong>
                                        ${this.state.player.kingAwareness}
                                    </strong>
                                </p>

                            </div>

                        </section>


                        <section class="panel">

                            <div class="panel-title">
                                🍺 RUMORES
                            </div>

                            <div class="information-list">

                                ${this.renderInformation()}

                            </div>

                        </section>


                        <section class="panel log-panel">

                            <div class="panel-title">
                                📖 DIÁRIO
                            </div>

                            <div class="game-log">

                                ${this.renderLog()}

                            </div>

                        </section>

                    </aside>

                </div>


                <footer class="game-footer">

                    <button
                        onclick="CavDev.newRun()"
                    >
                        🌑 NOVA REALIDADE
                    </button>

                    <span>
                        CAVDEV RPG • CRÔNICAS DO SOL NEGRO
                    </span>

                    <span>
                        Turno ${this.state.turn}
                    </span>

                </footer>

            </div>
        `;
    }
};


/* ============================================================
   CSS
   ============================================================ */

const style =
document.createElement("style");

style.textContent = `

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    background:
        radial-gradient(
            circle at top,
            #1c2230,
            #090b10 55%,
            #050609
        );

    color: #e7e9ee;

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    min-height: 100vh;
}


button {

    border: 0;

    cursor: pointer;

    color: #eee;

    background:
        linear-gradient(
            145deg,
            #242b38,
            #151a23
        );

    border:
        1px solid #394354;

    border-radius: 8px;

    transition:
        .2s ease;
}


button:hover {

    transform:
        translateY(-2px);

    border-color:
        #8a51fc;

    box-shadow:
        0 0 15px
        rgba(138,81,252,.2);
}


.game-shell {

    width: 100%;

    max-width: 1800px;

    margin: auto;

    padding: 18px;
}


.hero-hud {

    display: grid;

    grid-template-columns:
        1.2fr
        2fr
        1fr;

    gap: 18px;

    padding: 20px;

    margin-bottom: 18px;

    background:
        linear-gradient(
            135deg,
            rgba(24,29,39,.98),
            rgba(12,15,21,.98)
        );

    border:
        1px solid #313948;

    border-radius: 16px;

    box-shadow:
        0 15px 45px
        rgba(0,0,0,.35);
}


.hero-main {

    display: flex;

    align-items: center;

    gap: 15px;
}


.avatar {

    width: 72px;

    height: 72px;

    display: grid;

    place-items: center;

    font-size: 38px;

    background:
        radial-gradient(
            circle,
            #303949,
            #11151d
        );

    border-radius: 50%;

    border:
        2px solid #596478;
}


.hero-main h2 {

    margin: 0 0 5px;

    font-size: 23px;
}


.hero-main span {

    color: #9ea8b8;

    display: block;
}


.hero-main small {

    display: block;

    margin-top: 8px;

    color: #a78bfa;
}


.bars {

    display: flex;

    flex-direction: column;

    justify-content: center;

    gap: 10px;
}


.bar-box > div:first-child {

    display: flex;

    justify-content: space-between;

    font-size: 12px;

    margin-bottom: 5px;

    color: #aeb7c7;
}


.bar {

    height: 8px;

    overflow: hidden;

    border-radius: 10px;

    background: #090b0f;
}


.bar i {

    display: block;

    height: 100%;

    background: #e24b4b;
}


.bar.xp i {

    background: #8a51fc;
}


.bar.fatigue i {

    background: #d9a441;
}


.quick-values {

    display: grid;

    grid-template-columns:
        repeat(2,1fr);

    gap: 10px;
}


.quick-values div {

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    background: #11151d;

    border:
        1px solid #29313e;

    border-radius: 10px;
}


.quick-values span {

    font-size: 11px;

    color: #858fa1;
}


.quick-values strong {

    font-size: 19px;
}


.dashboard {

    display: grid;

    grid-template-columns:
        1fr
        1.7fr
        1.2fr;

    gap: 18px;

    align-items: start;
}


.left-column,
.center-column,
.right-column {

    display: flex;

    flex-direction: column;

    gap: 18px;
}


.panel,
.location-card,
.map-world {

    background:
        rgba(15,19,26,.94);

    border:
        1px solid #2d3543;

    border-radius: 13px;

    padding: 16px;

    box-shadow:
        0 8px 25px
        rgba(0,0,0,.2);
}


.panel-title {

    font-size: 12px;

    letter-spacing: 1.5px;

    color: #8f9aad;

    border-bottom:
        1px solid #282f3b;

    padding-bottom: 10px;

    margin-bottom: 14px;
}


.location-card {

    display: flex;

    gap: 15px;

    align-items: center;
}


.big-icon {

    font-size: 38px;
}


.location-card small {

    color: #747e90;

    letter-spacing: 1px;
}


.location-card h3 {

    margin: 4px 0;

    font-size: 19px;
}


.location-card p {

    margin: 0;

    color: #8e98a9;

    font-size: 13px;
}


.stat-row {

    display: flex;

    justify-content: space-between;

    padding: 7px 0;

    color: #aab3c2;
}


.stat-row strong {

    color: #fff;
}


.equipment-slot {

    padding: 12px;

    margin-bottom: 8px;

    border:
        1px solid #29313e;

    border-radius: 9px;

    display: flex;

    flex-direction: column;

    gap: 3px;
}


.equipment-slot span {

    font-size: 11px;

    color: #788396;
}


.equipment-slot small {

    color: #8e98a9;

    font-size: 11px;
}


.action-grid {

    display: grid;

    grid-template-columns:
        repeat(3,1fr);

    gap: 9px;
}


.action-grid button {

    min-height: 75px;

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    gap: 7px;

    font-size: 22px;
}


.action-grid button span {

    font-size: 11px;

    color: #aeb7c5;
}


.map-world {

    overflow: hidden;
}


.map-title {

    text-align: center;

    font-size: 12px;

    letter-spacing: 2px;

    color: #9aa5b7;

    margin-bottom: 20px;
}


.map-line {

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 8px;
}


.map-line button {

    min-width: 85px;

    padding: 10px 5px;

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 5px;

    font-size: 22px;
}


.map-line button span {

    font-size: 10px;

    color: #aeb7c5;
}


.route {

    width: 30px;

    height: 2px;

    background:
        linear-gradient(
            90deg,
            #4a5363,
            #252b36
        );
}


.map-warning {

    margin-top: 18px;

    padding: 10px;

    border-radius: 8px;

    background: rgba(138,81,252,.07);

    color: #9c92b6;

    font-size: 11px;

    line-height: 1.5;
}


.inventory-list {

    display: flex;

    flex-direction: column;

    gap: 8px;

    max-height: 420px;

    overflow-y: auto;
}


.inventory-item {

    display: grid;

    grid-template-columns:
        40px
        1fr
        auto;

    gap: 10px;

    align-items: center;

    padding: 10px;

    background: #11161f;

    border:
        1px solid #28303c;

    border-radius: 9px;
}


.item-icon {

    width: 38px;

    height: 38px;

    display: grid;

    place-items: center;

    font-size: 22px;

    background: #1c2330;

    border-radius: 8px;
}


.item-info {

    display: flex;

    flex-direction: column;

    gap: 3px;
}


.item-info strong {

    font-size: 13px;
}


.item-info small {

    color: #a78bfa;

    font-size: 10px;
}


.item-info span {

    color: #8993a4;

    font-size: 10px;
}


.item-actions {

    display: flex;

    gap: 5px;
}


.item-actions button {

    padding: 6px 8px;

    font-size: 10px;
}


.shop-list {

    display: flex;

    flex-direction: column;

    gap: 7px;

    max-height: 430px;

    overflow-y: auto;
}


.shop-item {

    display: grid;

    grid-template-columns:
        30px
        1fr
        auto;

    gap: 7px;

    align-items: center;

    padding: 9px;

    background: #11161f;

    border-radius: 8px;

    border:
        1px solid #272f3b;
}


.shop-item > span {

    font-size: 18px;
}


.shop-item div {

    display: flex;

    flex-direction: column;
}


.shop-item strong {

    font-size: 11px;
}


.shop-item small {

    color: #8a51fc;

    font-size: 9px;
}


.shop-item button {

    padding: 6px 8px;

    font-size: 10px;
}


.rumor {

    display: flex;

    gap: 9px;

    padding: 9px;

    border-bottom:
        1px solid #242b35;
}


.rumor p {

    margin: 0;

    font-size: 11px;

    line-height: 1.5;

    color: #aab3c1;
}


.trajectory p {

    display: flex;

    justify-content: space-between;

    gap: 10px;

    font-size: 11px;

    color: #788395;
}


.trajectory strong {

    color: #cbd1dc;

    text-align: right;
}


.game-log {

    max-height: 300px;

    overflow-y: auto;
}


.log-entry {

    padding: 7px 0;

    border-bottom:
        1px solid #202731;

    font-size: 11px;

    line-height: 1.5;

    color: #aeb7c4;
}


.log-entry span {

    color: #596475;

    margin-right: 6px;
}


.combat-panel {

    padding: 18px;

    border:
        1px solid #713d4b;

    border-radius: 13px;

    background:
        linear-gradient(
            135deg,
            rgba(72,27,39,.55),
            rgba(17,14,20,.95)
        );
}


.combat-title {

    color: #ed7887;

    font-size: 12px;

    letter-spacing: 2px;

    margin-bottom: 14px;
}


.enemy {

    display: flex;

    align-items: center;

    gap: 15px;
}


.enemy-avatar {

    width: 65px;

    height: 65px;

    display: grid;

    place-items: center;

    font-size: 35px;

    background: #21151b;

    border-radius: 12px;
}


.enemy h3 {

    margin: 0 0 3px;
}


.enemy span,
.enemy small {

    color: #8e98a9;

    font-size: 11px;
}


.enemy .bar {

    margin-top: 8px;

    width: 280px;
}


.attack-button {

    width: 100%;

    margin-top: 15px;

    padding: 13px;

    background:
        linear-gradient(
            135deg,
            #7d273b,
            #4b1827
        );

    border-color:
        #a33c52;

    font-weight: bold;
}


.travel-progress {

    width: 220px;

    height: 5px;

    background: #080a0e;

    margin: 7px 0;

    border-radius: 10px;

    overflow: hidden;
}


.travel-progress span {

    display: block;

    height: 100%;

    background: #8a51fc;
}


.game-footer {

    margin-top: 18px;

    padding: 15px;

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 15px;

    color: #687384;

    font-size: 10px;

    border-top:
        1px solid #202733;
}


.game-footer button {

    padding: 8px 12px;

    font-size: 10px;
}


.empty {

    color: #606b7b;

    text-align: center;

    padding: 20px;

    font-size: 12px;
}


@media (max-width: 1200px) {

    .dashboard {

        grid-template-columns:
            1fr 1fr;
    }

    .right-column {

        grid-column:
            1 / -1;

        display: grid;

        grid-template-columns:
            repeat(3,1fr);
    }

}


@media (max-width: 800px) {

    .hero-hud {

        grid-template-columns: 1fr;
    }

    .dashboard {

        grid-template-columns: 1fr;
    }

    .right-column {

        grid-column: auto;

        display: flex;
    }

    .action-grid {

        grid-template-columns:
            repeat(2,1fr);
    }

    .map-line {

        overflow-x: auto;

        justify-content: flex-start;
    }

    .game-footer {

        flex-direction: column;
    }
}

`;

document.head.appendChild(style);


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        CavDev.createReality();

    }
);


/* ============================================================
   EXPOR GLOBALMENTE
   ============================================================ */

window.CavDev = CavDev;
