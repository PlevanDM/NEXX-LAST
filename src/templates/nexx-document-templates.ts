/**
 * NEXX GSM Document Templates
 * Templates for: Intake, Release, Buyback, Recycling
 * Languages: Ukrainian, Russian, English, Romanian
 */

// ============================================
// INTAKE (ПРИЕМКА) TEMPLATE
// ============================================

export const INTAKE_TEMPLATE = {
  uk: {
    title: 'Акт прийому пристрою',
    form: {
      date: 'Дата прийому',
      orderNumber: 'Номер замовлення',
      customerName: 'Ім\'я клієнта',
      customerPhone: 'Телефон',
      customerEmail: 'Email',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceColor: 'Колір',
      deviceSerial: 'Серійний номер',
      deviceIMEI: 'IMEI',
      condition: 'Стан пристрою',
      damage: 'Видимі пошкодження',
      accessories: 'Комплектація',
      password: 'Пароль/PIN',
      icloud: 'Apple ID / iCloud',
      Samsung: 'Samsung Account',
      googleAccount: 'Google Account',
      notes: 'Примітки клієнта',
      estimatedPrice: 'Орієнтовна вартість',
      executorName: 'Прізвище майстра',
      executorSign: 'Підпис майстра',
      clientSign: 'Підпис клієнта'
    },
    sections: {
      header: 'Прийом пристрою на ремонт',
      deviceInfo: 'Інформація про пристрій',
      conditionInfo: 'Стан та комплектація',
      accountInfo: 'Облікові записи',
      agreement: 'Клієнт погоджується з умовами обслуговування',
      signature: 'Підписи'
    }
  },
  ru: {
    title: 'Акт приема устройства',
    form: {
      date: 'Дата приема',
      orderNumber: 'Номер заказа',
      customerName: 'Имя клиента',
      customerPhone: 'Телефон',
      customerEmail: 'Email',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceColor: 'Цвет',
      deviceSerial: 'Серийный номер',
      deviceIMEI: 'IMEI',
      condition: 'Состояние устройства',
      damage: 'Видимые повреждения',
      accessories: 'Комплектация',
      password: 'Пароль/PIN',
      icloud: 'Apple ID / iCloud',
      Samsung: 'Samsung Account',
      googleAccount: 'Google Account',
      notes: 'Примечания клиента',
      estimatedPrice: 'Ориентировочная стоимость',
      executorName: 'Фамилия мастера',
      executorSign: 'Подпись мастера',
      clientSign: 'Подпись клиента'
    },
    sections: {
      header: 'Приемка устройства на ремонт',
      deviceInfo: 'Информация об устройстве',
      conditionInfo: 'Состояние и комплектация',
      accountInfo: 'Учетные записи',
      agreement: 'Клиент согласен с условиями обслуживания',
      signature: 'Подписи'
    }
  },
  en: {
    title: 'Device Intake Form',
    form: {
      date: 'Intake Date',
      orderNumber: 'Order Number',
      customerName: 'Customer Name',
      customerPhone: 'Phone',
      customerEmail: 'Email',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceColor: 'Color',
      deviceSerial: 'Serial Number',
      deviceIMEI: 'IMEI',
      condition: 'Device Condition',
      damage: 'Visible Damage',
      accessories: 'Accessories',
      password: 'Password/PIN',
      icloud: 'Apple ID / iCloud',
      Samsung: 'Samsung Account',
      googleAccount: 'Google Account',
      notes: 'Customer Notes',
      estimatedPrice: 'Estimated Cost',
      executorName: 'Technician Name',
      executorSign: 'Technician Signature',
      clientSign: 'Client Signature'
    },
    sections: {
      header: 'Device Intake for Repair',
      deviceInfo: 'Device Information',
      conditionInfo: 'Condition & Accessories',
      accountInfo: 'User Accounts',
      agreement: 'Customer agrees with service terms',
      signature: 'Signatures'
    }
  },
  ro: {
    title: 'Formular de primire dispozitiv',
    form: {
      date: 'Data primirii',
      orderNumber: 'Numărul comenzii',
      customerName: 'Numele clientului',
      customerPhone: 'Telefon',
      customerEmail: 'Email',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceColor: 'Culoare',
      deviceSerial: 'Numărul de serie',
      deviceIMEI: 'IMEI',
      condition: 'Starea dispozitivului',
      damage: 'Daune vizibile',
      accessories: 'Accesorii',
      password: 'Parola/PIN',
      icloud: 'Apple ID / iCloud',
      Samsung: 'Samsung Account',
      googleAccount: 'Google Account',
      notes: 'Observații client',
      estimatedPrice: 'Cost estimat',
      executorName: 'Numele tehnician',
      executorSign: 'Semnatura tehnician',
      clientSign: 'Semnatura client'
    },
    sections: {
      header: 'Primire dispozitiv pentru reparație',
      deviceInfo: 'Informații dispozitiv',
      conditionInfo: 'Stare și accesorii',
      accountInfo: 'Conturi utilizator',
      agreement: 'Clientul acceptă termenii serviciului',
      signature: 'Semnături'
    }
  }
};

// ============================================
// RELEASE (ВЫДАЧА) TEMPLATE
// ============================================

export const RELEASE_TEMPLATE = {
  uk: {
    title: 'Акт видачі пристрою',
    form: {
      date: 'Дата видачі',
      orderNumber: 'Номер замовлення',
      intakeDate: 'Дата прийому',
      repairStartDate: 'Дата початку ремонту',
      repairEndDate: 'Дата завершення ремонту',
      customerName: 'Ім\'я клієнта',
      customerPhone: 'Телефон',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серійний номер',
      repairWork: 'Проведена робота',
      parts: 'Використані деталі',
      totalCost: 'Загальна вартість',
      paid: 'Оплачено',
      remaining: 'Залишок',
      warranty: 'Гарантія (днів)',
      condition: 'Стан після ремонту',
      notes: 'Примітки щодо роботи',
      executorName: 'Прізвище майстра',
      executorSign: 'Підпис майстра',
      clientSign: 'Підпис клієнта',
      stamp: 'Печатка',
      warrantyValid: 'Гарантія дійсна до'
    },
    sections: {
      header: 'Видача відремонтованого пристрою',
      repairInfo: 'Інформація про ремонт',
      workDone: 'Виконані роботи',
      costs: 'Вартість',
      warranty: 'Гарантія',
      completion: 'Завершення'
    }
  },
  ru: {
    title: 'Акт выдачи устройства',
    form: {
      date: 'Дата выдачи',
      orderNumber: 'Номер заказа',
      intakeDate: 'Дата приема',
      repairStartDate: 'Дата начала ремонта',
      repairEndDate: 'Дата завершения ремонта',
      customerName: 'Имя клиента',
      customerPhone: 'Телефон',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серийный номер',
      repairWork: 'Выполненные работы',
      parts: 'Использованные детали',
      totalCost: 'Общая стоимость',
      paid: 'Оплачено',
      remaining: 'Остаток',
      warranty: 'Гарантия (дней)',
      condition: 'Состояние после ремонта',
      notes: 'Примечания по работе',
      executorName: 'Фамилия мастера',
      executorSign: 'Подпись мастера',
      clientSign: 'Подпись клиента',
      stamp: 'Печать',
      warrantyValid: 'Гарантия действительна до'
    },
    sections: {
      header: 'Выдача отремонтированного устройства',
      repairInfo: 'Информация о ремонте',
      workDone: 'Выполненные работы',
      costs: 'Стоимость',
      warranty: 'Гарантия',
      completion: 'Завершение'
    }
  },
  en: {
    title: 'Device Release Form',
    form: {
      date: 'Release Date',
      orderNumber: 'Order Number',
      intakeDate: 'Intake Date',
      repairStartDate: 'Repair Start Date',
      repairEndDate: 'Repair End Date',
      customerName: 'Customer Name',
      customerPhone: 'Phone',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceSerial: 'Serial Number',
      repairWork: 'Repair Work Done',
      parts: 'Parts Used',
      totalCost: 'Total Cost',
      paid: 'Paid',
      remaining: 'Remaining',
      warranty: 'Warranty (days)',
      condition: 'Device Condition',
      notes: 'Work Notes',
      executorName: 'Technician Name',
      executorSign: 'Technician Signature',
      clientSign: 'Client Signature',
      stamp: 'Official Stamp',
      warrantyValid: 'Warranty Valid Until'
    },
    sections: {
      header: 'Device Release / Completion',
      repairInfo: 'Repair Information',
      workDone: 'Completed Work',
      costs: 'Costs',
      warranty: 'Warranty',
      completion: 'Completion'
    }
  },
  ro: {
    title: 'Formular de predare dispozitiv',
    form: {
      date: 'Data predării',
      orderNumber: 'Numărul comenzii',
      intakeDate: 'Data primirii',
      repairStartDate: 'Data începerii reparației',
      repairEndDate: 'Data finalizării reparației',
      customerName: 'Numele clientului',
      customerPhone: 'Telefon',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceSerial: 'Numărul de serie',
      repairWork: 'Lucrări efectuate',
      parts: 'Piese folosite',
      totalCost: 'Cost total',
      paid: 'Plătit',
      remaining: 'Rest',
      warranty: 'Garanție (zile)',
      condition: 'Starea dispozitivului',
      notes: 'Observații asupra lucrării',
      executorName: 'Numele tehnician',
      executorSign: 'Semnatura tehnician',
      clientSign: 'Semnatura client',
      stamp: 'Ștampilă oficială',
      warrantyValid: 'Garanția valabilă până la'
    },
    sections: {
      header: 'Predare dispozitiv reparat',
      repairInfo: 'Informații reparație',
      workDone: 'Lucrări efectuate',
      costs: 'Costuri',
      warranty: 'Garanție',
      completion: 'Finalizare'
    }
  }
};

// ============================================
// BUYBACK (ВЫКУП) TEMPLATE
// ============================================

export const BUYBACK_TEMPLATE = {
  uk: {
    title: 'Акт виконання послуги виконання',
    subtitle: 'Форма выкупу/обміну пристрою',
    form: {
      date: 'Дата виконання',
      orderNumber: 'Номер замовлення',
      buybackType: 'Тип: Виконання послуги / Обмін / Виконання',
      customerName: 'Ім\'я клієнта',
      customerPhone: 'Телефон',
      customerEmail: 'Email',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серійний номер',
      deviceCondition: 'Стан пристрою',
      deviceValue: 'Вартість пристрою',
      newDeviceType: 'Новий пристрій (тип)',
      newDeviceBrand: 'Нова марка',
      newDeviceModel: 'Нова модель',
      newDevicePrice: 'Ціна нового',
      discount: 'Знижка за обмін',
      cashPayment: 'Готівкове виконання',
      finalPrice: 'Остаточна ціна',
      paymentMethod: 'Спосіб оплати',
      notes: 'Примітки',
      executorName: 'Прізвище матера',
      executorSign: 'Підпис майстра',
      clientSign: 'Підпис клієнта'
    },
    sections: {
      header: 'Акт виконання послуги',
      oldDevice: 'Інформація про старий пристрій',
      newDevice: 'Інформація про новий пристрій',
      pricing: 'Розрахунок',
      completion: 'Завершення'
    }
  },
  ru: {
    title: 'Акт выполнения услуги',
    subtitle: 'Форма выкупа/обмена устройства',
    form: {
      date: 'Дата выполнения',
      orderNumber: 'Номер заказа',
      buybackType: 'Тип: Выкуп / Обмен / Trade-In',
      customerName: 'Имя клиента',
      customerPhone: 'Телефон',
      customerEmail: 'Email',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серийный номер',
      deviceCondition: 'Состояние устройства',
      deviceValue: 'Стоимость устройства',
      newDeviceType: 'Новое устройство (тип)',
      newDeviceBrand: 'Новая марка',
      newDeviceModel: 'Новая модель',
      newDevicePrice: 'Цена нового',
      discount: 'Скидка за обмен',
      cashPayment: 'Денежное выполнение',
      finalPrice: 'Окончательная цена',
      paymentMethod: 'Способ оплаты',
      notes: 'Примечания',
      executorName: 'Фамилия мастера',
      executorSign: 'Подпись мастера',
      clientSign: 'Подпись клиента'
    },
    sections: {
      header: 'Акт выполнения услуги',
      oldDevice: 'Информация о старом устройстве',
      newDevice: 'Информация о новом устройстве',
      pricing: 'Расчет',
      completion: 'Завершение'
    }
  },
  en: {
    title: 'Service Completion Form',
    subtitle: 'Device Buyback / Trade-In Form',
    form: {
      date: 'Completion Date',
      orderNumber: 'Order Number',
      buybackType: 'Type: Buyback / Trade-In / Exchange',
      customerName: 'Customer Name',
      customerPhone: 'Phone',
      customerEmail: 'Email',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceSerial: 'Serial Number',
      deviceCondition: 'Device Condition',
      deviceValue: 'Device Value',
      newDeviceType: 'New Device (type)',
      newDeviceBrand: 'New Brand',
      newDeviceModel: 'New Model',
      newDevicePrice: 'New Device Price',
      discount: 'Trade-In Discount',
      cashPayment: 'Cash Payment',
      finalPrice: 'Final Price',
      paymentMethod: 'Payment Method',
      notes: 'Notes',
      executorName: 'Technician Name',
      executorSign: 'Technician Signature',
      clientSign: 'Client Signature'
    },
    sections: {
      header: 'Service Completion Form',
      oldDevice: 'Old Device Information',
      newDevice: 'New Device Information',
      pricing: 'Pricing Calculation',
      completion: 'Completion'
    }
  },
  ro: {
    title: 'Formular de finalizare serviciu',
    subtitle: 'Formular de cumpărare / schimb dispozitiv',
    form: {
      date: 'Data finalizării',
      orderNumber: 'Numărul comenzii',
      buybackType: 'Tip: Cumpărare / Schimb / Trade-In',
      customerName: 'Numele clientului',
      customerPhone: 'Telefon',
      customerEmail: 'Email',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceSerial: 'Numărul de serie',
      deviceCondition: 'Starea dispozitivului',
      deviceValue: 'Valoarea dispozitivului',
      newDeviceType: 'Dispozitiv nou (tip)',
      newDeviceBrand: 'Marcă nouă',
      newDeviceModel: 'Model nou',
      newDevicePrice: 'Preț dispozitiv nou',
      discount: 'Reducere Trade-In',
      cashPayment: 'Plată în numerar',
      finalPrice: 'Preț final',
      paymentMethod: 'Metoda de plată',
      notes: 'Observații',
      executorName: 'Numele tehnician',
      executorSign: 'Semnatura tehnician',
      clientSign: 'Semnatura client'
    },
    sections: {
      header: 'Formular de finalizare serviciu',
      oldDevice: 'Informații dispozitiv vechi',
      newDevice: 'Informații dispozitiv nou',
      pricing: 'Calcul preț',
      completion: 'Finalizare'
    }
  }
};

// ============================================
// RECYCLING (УТИЛИЗАЦИЯ) TEMPLATE
// ============================================

export const RECYCLING_TEMPLATE = {
  uk: {
    title: 'Акт прийому на утилізацію',
    form: {
      date: 'Дата прийому',
      orderNumber: 'Номер акту',
      recyclingType: 'Тип утилізації: На переробку / Списання / Утилізація відходів',
      companyName: 'Компанія (сторона 1)',
      companyAddress: 'Адреса компанії',
      contactPerson: 'Контактна особа',
      contactPhone: 'Телефон контакту',
      receivingCompany: 'Компанія приймаючи (сторона 2)',
      receivingAddress: 'Адреса приймаючої компанії',
      receivingContact: 'Контактна особа приймаючої',
      receivingPhone: 'Телефон приймаючої',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      quantity: 'Кількість',
      totalWeight: 'Загальна вага (кг)',
      deviceSerial: 'Серійні номери',
      deviceCondition: 'Стан: Робочий / Не робочий / Частково',
      hazardousMaterials: 'Вміст небезпечних матеріалів: Батареї / Ртуть / Інші',
      description: 'Опис стану та вмісту',
      recyclingMethod: 'Метод утилізації',
      notes: 'Спеціальні примітки',
      transportInfo: 'Інформація про доставку',
      carNumber: 'Номер авто',
      driverName: 'Ім\'я водія',
      weight: 'Вага при завантаженні',
      deliveryDate: 'Дата доставки',
      certNumber: 'Номер сертифіката',
      executorSign: 'Підпис від сторони 1',
      receiverSign: 'Підпис від сторони 2',
      stamp: 'Печатка'
    },
    sections: {
      header: 'Акт прийому матеріалів на утилізацію',
      senderInfo: 'Інформація про відправника',
      receiverInfo: 'Інформація про приймаючого',
      deviceInfo: 'Інформація про обладнання',
      materialInfo: 'Інформація про матеріали',
      transport: 'Транспортування',
      signatures: 'Підписи і печатки'
    }
  },
  ru: {
    title: 'Акт приема на утилизацию',
    form: {
      date: 'Дата приема',
      orderNumber: 'Номер акта',
      recyclingType: 'Тип утилизации: На переработку / Списание / Утилизация отходов',
      companyName: 'Компания (сторона 1)',
      companyAddress: 'Адрес компании',
      contactPerson: 'Контактное лицо',
      contactPhone: 'Телефон контакта',
      receivingCompany: 'Компания принимающая (сторона 2)',
      receivingAddress: 'Адрес принимающей компании',
      receivingContact: 'Контактное лицо принимающей',
      receivingPhone: 'Телефон принимающей',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      quantity: 'Количество',
      totalWeight: 'Общий вес (кг)',
      deviceSerial: 'Серийные номера',
      deviceCondition: 'Состояние: Рабочее / Нерабочее / Частичное',
      hazardousMaterials: 'Содержание опасных материалов: Батареи / Ртуть / Другое',
      description: 'Описание состояния и содержания',
      recyclingMethod: 'Метод утилизации',
      notes: 'Специальные примечания',
      transportInfo: 'Информация о доставке',
      carNumber: 'Номер автомобиля',
      driverName: 'Имя водителя',
      weight: 'Вес при загрузке',
      deliveryDate: 'Дата доставки',
      certNumber: 'Номер сертификата',
      executorSign: 'Подпись от стороны 1',
      receiverSign: 'Подпись от стороны 2',
      stamp: 'Печать'
    },
    sections: {
      header: 'Акт приема материалов на утилизацию',
      senderInfo: 'Информация об отправителе',
      receiverInfo: 'Информация о принимающем',
      deviceInfo: 'Информация об оборудовании',
      materialInfo: 'Информация о материалах',
      transport: 'Транспортировка',
      signatures: 'Подписи и печати'
    }
  },
  en: {
    title: 'Equipment Disposal Form',
    form: {
      date: 'Reception Date',
      orderNumber: 'Act Number',
      recyclingType: 'Disposal Type: Recycling / Disposal / E-Waste',
      companyName: 'Company (Party 1)',
      companyAddress: 'Company Address',
      contactPerson: 'Contact Person',
      contactPhone: 'Contact Phone',
      receivingCompany: 'Receiving Company (Party 2)',
      receivingAddress: 'Receiving Address',
      receivingContact: 'Receiving Contact Person',
      receivingPhone: 'Receiving Phone',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      quantity: 'Quantity',
      totalWeight: 'Total Weight (kg)',
      deviceSerial: 'Serial Numbers',
      deviceCondition: 'Condition: Working / Non-working / Partial',
      hazardousMaterials: 'Hazardous Materials: Batteries / Mercury / Other',
      description: 'Description of Condition and Contents',
      recyclingMethod: 'Disposal Method',
      notes: 'Special Notes',
      transportInfo: 'Transport Information',
      carNumber: 'Vehicle Number',
      driverName: 'Driver Name',
      weight: 'Weight at Loading',
      deliveryDate: 'Delivery Date',
      certNumber: 'Certificate Number',
      executorSign: 'Party 1 Signature',
      receiverSign: 'Party 2 Signature',
      stamp: 'Official Stamp'
    },
    sections: {
      header: 'Equipment Disposal Act',
      senderInfo: 'Sender Information',
      receiverInfo: 'Receiver Information',
      deviceInfo: 'Equipment Information',
      materialInfo: 'Material Information',
      transport: 'Transport',
      signatures: 'Signatures & Stamps'
    }
  },
  ro: {
    title: 'Formular de primire pentru reciclare',
    form: {
      date: 'Data primirii',
      orderNumber: 'Numărul actului',
      recyclingType: 'Tip reciclare: Reciclare / Eliminare / Deșeuri electronice',
      companyName: 'Companie (Partea 1)',
      companyAddress: 'Adresa companie',
      contactPerson: 'Persoană de contact',
      contactPhone: 'Telefon contact',
      receivingCompany: 'Companie primire (Partea 2)',
      receivingAddress: 'Adresa primire',
      receivingContact: 'Persoană de contact primire',
      receivingPhone: 'Telefon primire',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      quantity: 'Cantitate',
      totalWeight: 'Greutate totală (kg)',
      deviceSerial: 'Numere de serie',
      deviceCondition: 'Stare: Funcțional / Non-funcțional / Parțial',
      hazardousMaterials: 'Materiale periculoase: Baterii / Mercur / Altele',
      description: 'Descrierea stării și conținutului',
      recyclingMethod: 'Metoda de reciclare',
      notes: 'Observații speciale',
      transportInfo: 'Informații transport',
      carNumber: 'Numărul vehiculului',
      driverName: 'Numele șoferului',
      weight: 'Greutate la încărcare',
      deliveryDate: 'Data livrării',
      certNumber: 'Numărul certificatului',
      executorSign: 'Semnatura Partea 1',
      receiverSign: 'Semnatura Partea 2',
      stamp: 'Ștampilă oficială'
    },
    sections: {
      header: 'Formular de primire pentru reciclare',
      senderInfo: 'Informații expeditor',
      receiverInfo: 'Informații receptor',
      deviceInfo: 'Informații echipament',
      materialInfo: 'Informații materiale',
      transport: 'Transport',
      signatures: 'Semnături și ștampile'
    }
  }
};

// ============================================
// Export all templates
// ============================================

export const NEXX_TEMPLATES = {
  intake: INTAKE_TEMPLATE,
  release: RELEASE_TEMPLATE,
  buyback: BUYBACK_TEMPLATE,
  recycling: RECYCLING_TEMPLATE
};

export default NEXX_TEMPLATES;
