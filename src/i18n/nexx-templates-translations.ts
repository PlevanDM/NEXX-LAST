/**
 * NEXX GSM Template Translations for i18n.js
 * Add this to your i18n.js file before each language's "meta:" line
 */

// ============================================
// UKRAINIAN (uk) - Add before meta line
// ============================================

const uk_nexxTemplates = {
  nexxTemplates: {
    intake: {
      title: 'Акт прийому пристрою',
      sections: ['Інформація про пристрій', 'Стан та комплектація', 'Облікові записи', 'Підписи'],
      description: 'Device intake form for repair service'
    },
    release: {
      title: 'Акт видачі пристрою',
      sections: ['Інформація про ремонт', 'Виконані роботи', 'Вартість', 'Гарантія', 'Підписи'],
      description: 'Device release / completion form'
    },
    buyback: {
      title: 'Акт виконання послуги',
      sections: ['Старий пристрій', 'Новий пристрій', 'Розрахунок', 'Оплата', 'Підписи'],
      description: 'Device buyback / trade-in form'
    },
    recycling: {
      title: 'Акт прийому на утилізацію',
      sections: ['Відправник', 'Приймаючий', 'Обладнання', 'Матеріали', 'Транспорт', 'Підписи'],
      description: 'Equipment disposal / recycling form'
    }
  }
};

// ============================================
// RUSSIAN (ru) - Add before meta line
// ============================================

const ru_nexxTemplates = {
  nexxTemplates: {
    intake: {
      title: 'Акт приема устройства',
      sections: ['Информация об устройстве', 'Состояние и комплектация', 'Учетные записи', 'Подписи'],
      description: 'Device intake form for repair service'
    },
    release: {
      title: 'Акт выдачи устройства',
      sections: ['Информация о ремонте', 'Выполненные работы', 'Стоимость', 'Гарантия', 'Подписи'],
      description: 'Device release / completion form'
    },
    buyback: {
      title: 'Акт выполнения услуги',
      sections: ['Старое устройство', 'Новое устройство', 'Расчет', 'Оплата', 'Подписи'],
      description: 'Device buyback / trade-in form'
    },
    recycling: {
      title: 'Акт приема на утилизацию',
      sections: ['Отправитель', 'Получатель', 'Оборудование', 'Материалы', 'Транспорт', 'Подписи'],
      description: 'Equipment disposal / recycling form'
    }
  }
};

// ============================================
// ENGLISH (en) - Add before meta line
// ============================================

const en_nexxTemplates = {
  nexxTemplates: {
    intake: {
      title: 'Device Intake Form',
      sections: ['Device Information', 'Condition & Accessories', 'User Accounts', 'Signatures'],
      description: 'Device intake form for repair service'
    },
    release: {
      title: 'Device Release Form',
      sections: ['Repair Information', 'Completed Work', 'Costs', 'Warranty', 'Signatures'],
      description: 'Device release / completion form'
    },
    buyback: {
      title: 'Service Completion Form',
      sections: ['Old Device', 'New Device', 'Calculation', 'Payment', 'Signatures'],
      description: 'Device buyback / trade-in form'
    },
    recycling: {
      title: 'Equipment Disposal Form',
      sections: ['Sender', 'Receiver', 'Equipment', 'Materials', 'Transport', 'Signatures'],
      description: 'Equipment disposal / recycling form'
    }
  }
};

// ============================================
// ROMANIAN (ro) - Add before meta line
// ============================================

const ro_nexxTemplates = {
  nexxTemplates: {
    intake: {
      title: 'Formular de primire dispozitiv',
      sections: ['Informații dispozitiv', 'Stare și accesorii', 'Conturi utilizator', 'Semnături'],
      description: 'Device intake form for repair service'
    },
    release: {
      title: 'Formular de predare dispozitiv',
      sections: ['Informații reparație', 'Lucrări efectuate', 'Costuri', 'Garanție', 'Semnături'],
      description: 'Device release / completion form'
    },
    buyback: {
      title: 'Formular de finalizare serviciu',
      sections: ['Dispozitiv vechi', 'Dispozitiv nou', 'Calcul', 'Plată', 'Semnături'],
      description: 'Device buyback / trade-in form'
    },
    recycling: {
      title: 'Formular de reciclare echipament',
      sections: ['Expeditor', 'Receptor', 'Echipament', 'Materiale', 'Transport', 'Semnături'],
      description: 'Equipment disposal / recycling form'
    }
  }
};

export { uk_nexxTemplates, ru_nexxTemplates, en_nexxTemplates, ro_nexxTemplates };
