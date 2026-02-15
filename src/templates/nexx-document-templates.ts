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
// ESTIMATE (СМЕТА / ОЦЕНКА) TEMPLATE
// ============================================

export const ESTIMATE_TEMPLATE = {
  uk: {
    title: 'Кошторис',
    form: {
      companyName: 'Назва компанії',
      companyAddress: 'Адреса компанії',
      companyEmail: 'Email компанії',
      companyNote: 'Примітка компанії',
      clientName: 'Ім\'я клієнта',
      clientEmail: 'Email клієнта',
      clientPhone: 'Телефон клієнта',
      clientAddress: 'Адреса клієнта',
      orderNumber: 'Номер замовлення',
      date: 'Дата',
      validUntil: 'Дійсний до',
      rowNumber: '№',
      productName: 'Назва послуги',
      productQty: 'Кількість',
      unitPrice: 'Ціна за одиницю (без ПДВ)',
      taxAmount: 'Сума ПДВ',
      productAmount: 'Сума',
      subtotal: 'Підсумок',
      taxName: 'Назва податку',
      taxRate: 'Ставка',
      taxValue: 'Сума податку',
      totalAmount: 'Загальна сума'
    },
    sections: {
      header: 'Кошторис на ремонт',
      clientInfo: 'Інформація про клієнта',
      serviceTable: 'Послуги та запчастини',
      totals: 'Підсумок',
      terms: 'Умови',
      signatures: 'Підписи'
    },
    terms: 'Наведені кошториси є орієнтовними. Вони базуються на очікуваних роботах. Непередбачені ускладнення можуть призвести до відхилення від початкової оцінки. Підписуючи, ви надаєте дозвіл на проведення описаних робіт.',
    allPartsNew: 'Всі запасні частини нові, якщо не зазначено інше.'
  },
  ru: {
    title: 'Смета',
    form: {
      companyName: 'Название компании',
      companyAddress: 'Адрес компании',
      companyEmail: 'Email компании',
      companyNote: 'Примечание компании',
      clientName: 'Имя клиента',
      clientEmail: 'Email клиента',
      clientPhone: 'Телефон клиента',
      clientAddress: 'Адрес клиента',
      orderNumber: 'Номер заказа',
      date: 'Дата',
      validUntil: 'Действителен до',
      rowNumber: '№',
      productName: 'Название услуги',
      productQty: 'Количество',
      unitPrice: 'Цена за единицу (без НДС)',
      taxAmount: 'Сумма НДС',
      productAmount: 'Сумма',
      subtotal: 'Итого',
      taxName: 'Название налога',
      taxRate: 'Ставка',
      taxValue: 'Сумма налога',
      totalAmount: 'Общая сумма'
    },
    sections: {
      header: 'Смета на ремонт',
      clientInfo: 'Информация о клиенте',
      serviceTable: 'Услуги и запчасти',
      totals: 'Итого',
      terms: 'Условия',
      signatures: 'Подписи'
    },
    terms: 'Приведённые сметы являются ориентировочными. Они основаны на ожидаемых работах. Непредвиденные осложнения могут привести к отклонению от первоначальной оценки. Подписывая, вы даёте разрешение на проведение описанных работ.',
    allPartsNew: 'Все запасные части новые, если не указано иное.'
  },
  en: {
    title: 'Estimate',
    form: {
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      companyEmail: 'Company Email',
      companyNote: 'Company Note',
      clientName: 'Client Name',
      clientEmail: 'Client Email',
      clientPhone: 'Client Phone',
      clientAddress: 'Client Address',
      orderNumber: 'Order Number',
      date: 'Date',
      validUntil: 'Valid Until',
      rowNumber: '#',
      productName: 'Description',
      productQty: 'Qty',
      unitPrice: 'Unit Price (Without Taxes)',
      taxAmount: 'Product Tax Amount',
      productAmount: 'Amount',
      subtotal: 'Subtotal',
      taxName: 'Tax Name',
      taxRate: 'Tax Rate',
      taxValue: 'Tax Value',
      totalAmount: 'Total Amount'
    },
    sections: {
      header: 'Repair Estimate',
      clientInfo: 'Client Information',
      serviceTable: 'Services & Parts',
      totals: 'Totals',
      terms: 'Terms & Conditions',
      signatures: 'Signatures'
    },
    terms: 'Estimates provided are an approximation of charges to you for the services requested. They are based on the anticipated work to be done. Unexpected complications may cause some deviation from the original quote. By signing, you authorize the repair work described in this estimate to be done and procuring the necessary material(s), including permission to operate testing or inspection. If any additional repairs are required, we will prepare a revised work order providing the cost of additional parts and labor and the total revised cost. All parts are new unless specified otherwise.',
    allPartsNew: 'All parts are new unless specified otherwise.'
  },
  ro: {
    title: 'Deviz estimativ',
    form: {
      companyName: 'Numele companiei',
      companyAddress: 'Adresa companiei',
      companyEmail: 'Email companie',
      companyNote: 'Notă companie',
      clientName: 'Numele clientului',
      clientEmail: 'Email client',
      clientPhone: 'Telefon client',
      clientAddress: 'Adresa client',
      orderNumber: 'Numărul comenzii',
      date: 'Data',
      validUntil: 'Valabil până la',
      rowNumber: '#',
      productName: 'Descriere serviciu',
      productQty: 'Cantitate',
      unitPrice: 'Preț unitar (fără TVA)',
      taxAmount: 'TVA produs',
      productAmount: 'Sumă',
      subtotal: 'Subtotal',
      taxName: 'Denumire taxă',
      taxRate: 'Cotă',
      taxValue: 'Valoare taxă',
      totalAmount: 'Total'
    },
    sections: {
      header: 'Deviz estimativ pentru reparație',
      clientInfo: 'Informații client',
      serviceTable: 'Servicii și piese',
      totals: 'Total',
      terms: 'Termeni și condiții',
      signatures: 'Semnături'
    },
    terms: 'Devizele furnizate sunt o aproximare a costurilor pentru serviciile solicitate. Acestea se bazează pe lucrările anticipate. Complicațiile neprevăzute pot cauza abateri de la estimarea inițială. Prin semnare, autorizați efectuarea lucrărilor de reparație descrise și procurarea materialelor necesare. Toate piesele sunt noi, dacă nu se specifică altfel.',
    allPartsNew: 'Toate piesele sunt noi, dacă nu se specifică altfel.'
  }
};

// ============================================
// INVOICE (ФАКТУРА) TEMPLATE
// ============================================

export const INVOICE_TEMPLATE = {
  uk: {
    title: 'Рахунок-фактура',
    form: {
      companyName: 'Назва компанії',
      companyAddress: 'Адреса',
      companyEmail: 'Email',
      clientName: 'Ім\'я клієнта',
      clientPhone: 'Телефон',
      clientEmail: 'Email клієнта',
      clientAddress: 'Адреса клієнта',
      invoiceNumber: 'Номер рахунку',
      orderNumber: 'Номер замовлення',
      date: 'Дата',
      dueDate: 'Оплатити до',
      paymentMethod: 'Спосіб оплати',
      rowNumber: '№',
      productName: 'Назва послуги',
      productQty: 'Кількість',
      unitPrice: 'Ціна',
      productAmount: 'Сума',
      subtotal: 'Підсумок',
      taxRate: 'ПДВ',
      taxValue: 'Сума ПДВ',
      totalAmount: 'До сплати',
      paid: 'Оплачено',
      remaining: 'Залишок'
    },
    sections: {
      header: 'Рахунок-фактура за ремонт',
      clientInfo: 'Платник',
      serviceTable: 'Послуги',
      payment: 'Оплата',
      notes: 'Примітки'
    }
  },
  ru: {
    title: 'Счёт-фактура',
    form: {
      companyName: 'Название компании',
      companyAddress: 'Адрес',
      companyEmail: 'Email',
      clientName: 'Имя клиента',
      clientPhone: 'Телефон',
      clientEmail: 'Email клиента',
      clientAddress: 'Адрес клиента',
      invoiceNumber: 'Номер счёта',
      orderNumber: 'Номер заказа',
      date: 'Дата',
      dueDate: 'Оплатить до',
      paymentMethod: 'Способ оплаты',
      rowNumber: '№',
      productName: 'Название услуги',
      productQty: 'Количество',
      unitPrice: 'Цена',
      productAmount: 'Сумма',
      subtotal: 'Итого',
      taxRate: 'НДС',
      taxValue: 'Сумма НДС',
      totalAmount: 'К оплате',
      paid: 'Оплачено',
      remaining: 'Остаток'
    },
    sections: {
      header: 'Счёт-фактура за ремонт',
      clientInfo: 'Плательщик',
      serviceTable: 'Услуги',
      payment: 'Оплата',
      notes: 'Примечания'
    }
  },
  en: {
    title: 'Invoice',
    form: {
      companyName: 'Company Name',
      companyAddress: 'Address',
      companyEmail: 'Email',
      clientName: 'Client Name',
      clientPhone: 'Phone',
      clientEmail: 'Client Email',
      clientAddress: 'Client Address',
      invoiceNumber: 'Invoice Number',
      orderNumber: 'Order Number',
      date: 'Date',
      dueDate: 'Due Date',
      paymentMethod: 'Payment Method',
      rowNumber: '#',
      productName: 'Description',
      productQty: 'Qty',
      unitPrice: 'Unit Price',
      productAmount: 'Amount',
      subtotal: 'Subtotal',
      taxRate: 'Tax Rate',
      taxValue: 'Tax',
      totalAmount: 'Total Due',
      paid: 'Paid',
      remaining: 'Balance Due'
    },
    sections: {
      header: 'Repair Invoice',
      clientInfo: 'Bill To',
      serviceTable: 'Services',
      payment: 'Payment',
      notes: 'Notes'
    }
  },
  ro: {
    title: 'Factură',
    form: {
      companyName: 'Numele companiei',
      companyAddress: 'Adresa',
      companyEmail: 'Email',
      clientName: 'Numele clientului',
      clientPhone: 'Telefon',
      clientEmail: 'Email client',
      clientAddress: 'Adresa client',
      invoiceNumber: 'Număr factură',
      orderNumber: 'Număr comandă',
      date: 'Data',
      dueDate: 'Scadența',
      paymentMethod: 'Metoda de plată',
      rowNumber: '#',
      productName: 'Descriere serviciu',
      productQty: 'Cantitate',
      unitPrice: 'Preț unitar',
      productAmount: 'Sumă',
      subtotal: 'Subtotal',
      taxRate: 'Cotă TVA',
      taxValue: 'TVA',
      totalAmount: 'Total de plată',
      paid: 'Achitat',
      remaining: 'Rest de plată'
    },
    sections: {
      header: 'Factură pentru reparație',
      clientInfo: 'Plătitor',
      serviceTable: 'Servicii',
      payment: 'Plată',
      notes: 'Observații'
    }
  }
};

// ============================================
// WARRANTY (ГАРАНТИЯ) TEMPLATE
// ============================================

export const WARRANTY_TEMPLATE = {
  uk: {
    title: 'Гарантійний талон',
    form: {
      date: 'Дата видачі',
      warrantyNumber: 'Номер гарантії',
      orderNumber: 'Номер замовлення',
      customerName: 'Ім\'я клієнта',
      customerPhone: 'Телефон',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серійний номер',
      repairWork: 'Виконані роботи',
      partsUsed: 'Використані запчастини',
      warrantyPeriod: 'Гарантійний термін (днів)',
      warrantyExpires: 'Гарантія дійсна до',
      conditions: 'Умови гарантії',
      executorName: 'Майстер',
      executorSign: 'Підпис майстра',
      clientSign: 'Підпис клієнта'
    },
    sections: {
      header: 'Гарантійний талон',
      repairInfo: 'Інформація про ремонт',
      warranty: 'Умови гарантії',
      signatures: 'Підписи'
    },
    conditions: 'Гарантія поширюється виключно на виконані роботи та замінені деталі. Гарантія не поширюється на пошкодження, спричинені механічним впливом, потраплянням вологи, самостійним ремонтом або використанням не за призначенням.'
  },
  ru: {
    title: 'Гарантийный талон',
    form: {
      date: 'Дата выдачи',
      warrantyNumber: 'Номер гарантии',
      orderNumber: 'Номер заказа',
      customerName: 'Имя клиента',
      customerPhone: 'Телефон',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серийный номер',
      repairWork: 'Выполненные работы',
      partsUsed: 'Использованные запчасти',
      warrantyPeriod: 'Гарантийный срок (дней)',
      warrantyExpires: 'Гарантия действительна до',
      conditions: 'Условия гарантии',
      executorName: 'Мастер',
      executorSign: 'Подпись мастера',
      clientSign: 'Подпись клиента'
    },
    sections: {
      header: 'Гарантийный талон',
      repairInfo: 'Информация о ремонте',
      warranty: 'Условия гарантии',
      signatures: 'Подписи'
    },
    conditions: 'Гарантия распространяется исключительно на выполненные работы и замененные детали. Гарантия не распространяется на повреждения, вызванные механическим воздействием, попаданием влаги, самостоятельным ремонтом или использованием не по назначению.'
  },
  en: {
    title: 'Warranty Card',
    form: {
      date: 'Issue Date',
      warrantyNumber: 'Warranty Number',
      orderNumber: 'Order Number',
      customerName: 'Customer Name',
      customerPhone: 'Phone',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceSerial: 'Serial Number',
      repairWork: 'Work Performed',
      partsUsed: 'Parts Used',
      warrantyPeriod: 'Warranty Period (days)',
      warrantyExpires: 'Warranty Expires',
      conditions: 'Warranty Conditions',
      executorName: 'Technician',
      executorSign: 'Technician Signature',
      clientSign: 'Client Signature'
    },
    sections: {
      header: 'Warranty Card',
      repairInfo: 'Repair Information',
      warranty: 'Warranty Terms',
      signatures: 'Signatures'
    },
    conditions: 'Warranty covers only the performed repairs and replaced parts. Warranty does not cover damage caused by mechanical impact, liquid exposure, unauthorized repair, or misuse.'
  },
  ro: {
    title: 'Certificat de garanție',
    form: {
      date: 'Data emiterii',
      warrantyNumber: 'Număr garanție',
      orderNumber: 'Număr comandă',
      customerName: 'Numele clientului',
      customerPhone: 'Telefon',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceSerial: 'Număr de serie',
      repairWork: 'Lucrări efectuate',
      partsUsed: 'Piese folosite',
      warrantyPeriod: 'Perioada de garanție (zile)',
      warrantyExpires: 'Garanția expiră la',
      conditions: 'Condiții de garanție',
      executorName: 'Tehnician',
      executorSign: 'Semnătura tehnicianului',
      clientSign: 'Semnătura clientului'
    },
    sections: {
      header: 'Certificat de garanție',
      repairInfo: 'Informații reparație',
      warranty: 'Termeni garanție',
      signatures: 'Semnături'
    },
    conditions: 'Garanția acoperă exclusiv lucrările efectuate și piesele înlocuite. Garanția nu acoperă daunele cauzate de impact mecanic, expunere la lichide, reparații neautorizate sau utilizare necorespunzătoare.'
  }
};

// ============================================
// TICKET (КВИТАНЦИЯ) TEMPLATE
// ============================================

export const TICKET_TEMPLATE = {
  uk: {
    title: 'Квитанція',
    form: {
      companyName: 'Назва компанії',
      companyAddress: 'Адреса',
      companyPhone: 'Телефон',
      orderNumber: 'Номер замовлення',
      date: 'Дата прийому',
      customerName: 'Ім\'я клієнта',
      customerPhone: 'Телефон клієнта',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серійний номер',
      problem: 'Несправність',
      estimatedPrice: 'Орієнтовна вартість',
      estimatedDate: 'Орієнтовна дата готовності',
      prepaid: 'Передоплата',
      executorName: 'Прийняв',
      notes: 'Примітки'
    },
    sections: {
      header: 'Квитанція про прийом',
      deviceInfo: 'Пристрій',
      orderInfo: 'Замовлення',
      footer: 'Зберігайте квитанцію до отримання пристрою'
    }
  },
  ru: {
    title: 'Квитанция',
    form: {
      companyName: 'Название компании',
      companyAddress: 'Адрес',
      companyPhone: 'Телефон',
      orderNumber: 'Номер заказа',
      date: 'Дата приема',
      customerName: 'Имя клиента',
      customerPhone: 'Телефон клиента',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серийный номер',
      problem: 'Неисправность',
      estimatedPrice: 'Ориентировочная стоимость',
      estimatedDate: 'Ориентировочная дата готовности',
      prepaid: 'Предоплата',
      executorName: 'Принял',
      notes: 'Примечания'
    },
    sections: {
      header: 'Квитанция о приеме',
      deviceInfo: 'Устройство',
      orderInfo: 'Заказ',
      footer: 'Сохраняйте квитанцию до получения устройства'
    }
  },
  en: {
    title: 'Ticket',
    form: {
      companyName: 'Company Name',
      companyAddress: 'Address',
      companyPhone: 'Phone',
      orderNumber: 'Order Number',
      date: 'Date',
      customerName: 'Customer Name',
      customerPhone: 'Customer Phone',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceSerial: 'Serial Number',
      problem: 'Problem Description',
      estimatedPrice: 'Estimated Cost',
      estimatedDate: 'Estimated Completion',
      prepaid: 'Prepaid Amount',
      executorName: 'Received By',
      notes: 'Notes'
    },
    sections: {
      header: 'Repair Ticket',
      deviceInfo: 'Device',
      orderInfo: 'Order',
      footer: 'Keep this ticket until device pickup'
    }
  },
  ro: {
    title: 'Bon de primire',
    form: {
      companyName: 'Numele companiei',
      companyAddress: 'Adresa',
      companyPhone: 'Telefon',
      orderNumber: 'Număr comandă',
      date: 'Data',
      customerName: 'Numele clientului',
      customerPhone: 'Telefon client',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceSerial: 'Număr de serie',
      problem: 'Defecțiune',
      estimatedPrice: 'Cost estimat',
      estimatedDate: 'Data estimată finalizare',
      prepaid: 'Avans',
      executorName: 'Primit de',
      notes: 'Observații'
    },
    sections: {
      header: 'Bon de primire reparație',
      deviceInfo: 'Dispozitiv',
      orderInfo: 'Comandă',
      footer: 'Păstrați bonul până la ridicarea dispozitivului'
    }
  }
};

// ============================================
// WORK ORDER (НАРЯД-ЗАКАЗ) TEMPLATE
// ============================================

export const WORK_ORDER_TEMPLATE = {
  uk: {
    title: 'Наряд-замовлення',
    form: {
      companyName: 'Компанія',
      orderNumber: 'Номер замовлення',
      date: 'Дата',
      dueDate: 'Термін виконання',
      customerName: 'Клієнт',
      customerPhone: 'Телефон',
      deviceType: 'Тип пристрою',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серійний номер',
      deviceIMEI: 'IMEI',
      problem: 'Опис несправності',
      diagnosticNotes: 'Результати діагностики',
      repairPlan: 'План робіт',
      partsNeeded: 'Необхідні запчастини',
      estimatedCost: 'Орієнтовна вартість',
      priority: 'Пріоритет',
      assignedTo: 'Виконавець',
      status: 'Статус'
    },
    sections: {
      header: 'Наряд-замовлення на ремонт',
      client: 'Клієнт',
      device: 'Пристрій',
      work: 'Роботи',
      parts: 'Запчастини',
      notes: 'Примітки'
    }
  },
  ru: {
    title: 'Наряд-заказ',
    form: {
      companyName: 'Компания',
      orderNumber: 'Номер заказа',
      date: 'Дата',
      dueDate: 'Срок выполнения',
      customerName: 'Клиент',
      customerPhone: 'Телефон',
      deviceType: 'Тип устройства',
      deviceBrand: 'Марка',
      deviceModel: 'Модель',
      deviceSerial: 'Серийный номер',
      deviceIMEI: 'IMEI',
      problem: 'Описание неисправности',
      diagnosticNotes: 'Результаты диагностики',
      repairPlan: 'План работ',
      partsNeeded: 'Необходимые запчасти',
      estimatedCost: 'Ориентировочная стоимость',
      priority: 'Приоритет',
      assignedTo: 'Исполнитель',
      status: 'Статус'
    },
    sections: {
      header: 'Наряд-заказ на ремонт',
      client: 'Клиент',
      device: 'Устройство',
      work: 'Работы',
      parts: 'Запчасти',
      notes: 'Примечания'
    }
  },
  en: {
    title: 'Work Order',
    form: {
      companyName: 'Company',
      orderNumber: 'Order Number',
      date: 'Date',
      dueDate: 'Due Date',
      customerName: 'Customer',
      customerPhone: 'Phone',
      deviceType: 'Device Type',
      deviceBrand: 'Brand',
      deviceModel: 'Model',
      deviceSerial: 'Serial Number',
      deviceIMEI: 'IMEI',
      problem: 'Problem Description',
      diagnosticNotes: 'Diagnostic Notes',
      repairPlan: 'Repair Plan',
      partsNeeded: 'Parts Needed',
      estimatedCost: 'Estimated Cost',
      priority: 'Priority',
      assignedTo: 'Assigned To',
      status: 'Status'
    },
    sections: {
      header: 'Repair Work Order',
      client: 'Client',
      device: 'Device',
      work: 'Work',
      parts: 'Parts',
      notes: 'Notes'
    }
  },
  ro: {
    title: 'Ordin de lucru',
    form: {
      companyName: 'Companie',
      orderNumber: 'Număr comandă',
      date: 'Data',
      dueDate: 'Termen de finalizare',
      customerName: 'Client',
      customerPhone: 'Telefon',
      deviceType: 'Tip dispozitiv',
      deviceBrand: 'Marcă',
      deviceModel: 'Model',
      deviceSerial: 'Număr de serie',
      deviceIMEI: 'IMEI',
      problem: 'Descrierea defecțiunii',
      diagnosticNotes: 'Rezultate diagnostic',
      repairPlan: 'Plan de lucru',
      partsNeeded: 'Piese necesare',
      estimatedCost: 'Cost estimat',
      priority: 'Prioritate',
      assignedTo: 'Atribuit lui',
      status: 'Status'
    },
    sections: {
      header: 'Ordin de lucru reparație',
      client: 'Client',
      device: 'Dispozitiv',
      work: 'Lucrări',
      parts: 'Piese',
      notes: 'Observații'
    }
  }
};

// ============================================
// PAYMENT RECEIPT (КВИТАНЦИЯ ОБ ОПЛАТЕ) TEMPLATE
// ============================================

export const PAYMENT_RECEIPT_TEMPLATE = {
  uk: {
    title: 'Квитанція про оплату',
    form: {
      companyName: 'Компанія',
      companyAddress: 'Адреса',
      receiptNumber: 'Номер квитанції',
      orderNumber: 'Номер замовлення',
      date: 'Дата',
      customerName: 'Клієнт',
      customerPhone: 'Телефон',
      paymentMethod: 'Спосіб оплати',
      amount: 'Сума',
      currency: 'Валюта',
      description: 'Опис платежу',
      cashierName: 'Касир',
      notes: 'Примітки'
    },
    sections: {
      header: 'Квитанція про оплату',
      payment: 'Деталі платежу',
      footer: 'Дякуємо за оплату!'
    }
  },
  ru: {
    title: 'Квитанция об оплате',
    form: {
      companyName: 'Компания',
      companyAddress: 'Адрес',
      receiptNumber: 'Номер квитанции',
      orderNumber: 'Номер заказа',
      date: 'Дата',
      customerName: 'Клиент',
      customerPhone: 'Телефон',
      paymentMethod: 'Способ оплаты',
      amount: 'Сумма',
      currency: 'Валюта',
      description: 'Описание платежа',
      cashierName: 'Кассир',
      notes: 'Примечания'
    },
    sections: {
      header: 'Квитанция об оплате',
      payment: 'Детали платежа',
      footer: 'Спасибо за оплату!'
    }
  },
  en: {
    title: 'Payment Receipt',
    form: {
      companyName: 'Company',
      companyAddress: 'Address',
      receiptNumber: 'Receipt Number',
      orderNumber: 'Order Number',
      date: 'Date',
      customerName: 'Customer',
      customerPhone: 'Phone',
      paymentMethod: 'Payment Method',
      amount: 'Amount',
      currency: 'Currency',
      description: 'Payment Description',
      cashierName: 'Cashier',
      notes: 'Notes'
    },
    sections: {
      header: 'Payment Receipt',
      payment: 'Payment Details',
      footer: 'Thank you for your payment!'
    }
  },
  ro: {
    title: 'Chitanță de plată',
    form: {
      companyName: 'Companie',
      companyAddress: 'Adresa',
      receiptNumber: 'Număr chitanță',
      orderNumber: 'Număr comandă',
      date: 'Data',
      customerName: 'Client',
      customerPhone: 'Telefon',
      paymentMethod: 'Metoda de plată',
      amount: 'Sumă',
      currency: 'Monedă',
      description: 'Descriere plată',
      cashierName: 'Casier',
      notes: 'Observații'
    },
    sections: {
      header: 'Chitanță de plată',
      payment: 'Detalii plată',
      footer: 'Vă mulțumim pentru plată!'
    }
  }
};

// ============================================
// SALE INVOICE (ТОВАРНАЯ НАКЛАДНАЯ) TEMPLATE
// ============================================

export const SALE_INVOICE_TEMPLATE = {
  uk: {
    title: 'Товарна накладна',
    form: {
      companyName: 'Постачальник',
      companyAddress: 'Адреса',
      invoiceNumber: 'Номер накладної',
      date: 'Дата',
      customerName: 'Покупець',
      customerAddress: 'Адреса покупця',
      rowNumber: '№',
      productName: 'Найменування товару',
      productQty: 'Кількість',
      unitPrice: 'Ціна',
      productAmount: 'Сума',
      subtotal: 'Підсумок',
      tax: 'ПДВ',
      totalAmount: 'Всього до оплати',
      paymentMethod: 'Спосіб оплати'
    },
    sections: {
      header: 'Товарна накладна',
      seller: 'Постачальник',
      buyer: 'Покупець',
      products: 'Товари',
      totals: 'Підсумок',
      signatures: 'Підписи'
    }
  },
  ru: {
    title: 'Товарная накладная',
    form: {
      companyName: 'Поставщик',
      companyAddress: 'Адрес',
      invoiceNumber: 'Номер накладной',
      date: 'Дата',
      customerName: 'Покупатель',
      customerAddress: 'Адрес покупателя',
      rowNumber: '№',
      productName: 'Наименование товара',
      productQty: 'Количество',
      unitPrice: 'Цена',
      productAmount: 'Сумма',
      subtotal: 'Итого',
      tax: 'НДС',
      totalAmount: 'Всего к оплате',
      paymentMethod: 'Способ оплаты'
    },
    sections: {
      header: 'Товарная накладная',
      seller: 'Поставщик',
      buyer: 'Покупатель',
      products: 'Товары',
      totals: 'Итого',
      signatures: 'Подписи'
    }
  },
  en: {
    title: 'Sale Invoice',
    form: {
      companyName: 'Seller',
      companyAddress: 'Address',
      invoiceNumber: 'Invoice Number',
      date: 'Date',
      customerName: 'Buyer',
      customerAddress: 'Buyer Address',
      rowNumber: '#',
      productName: 'Product Name',
      productQty: 'Qty',
      unitPrice: 'Unit Price',
      productAmount: 'Amount',
      subtotal: 'Subtotal',
      tax: 'Tax',
      totalAmount: 'Total Due',
      paymentMethod: 'Payment Method'
    },
    sections: {
      header: 'Sale Invoice',
      seller: 'Seller',
      buyer: 'Buyer',
      products: 'Products',
      totals: 'Totals',
      signatures: 'Signatures'
    }
  },
  ro: {
    title: 'Factură de vânzare',
    form: {
      companyName: 'Furnizor',
      companyAddress: 'Adresa',
      invoiceNumber: 'Număr factură',
      date: 'Data',
      customerName: 'Cumpărător',
      customerAddress: 'Adresa cumpărător',
      rowNumber: '#',
      productName: 'Denumire produs',
      productQty: 'Cantitate',
      unitPrice: 'Preț unitar',
      productAmount: 'Sumă',
      subtotal: 'Subtotal',
      tax: 'TVA',
      totalAmount: 'Total de plată',
      paymentMethod: 'Metoda de plată'
    },
    sections: {
      header: 'Factură de vânzare',
      seller: 'Furnizor',
      buyer: 'Cumpărător',
      products: 'Produse',
      totals: 'Total',
      signatures: 'Semnături'
    }
  }
};

// ============================================
// Export all templates (matches Remonline document types)
// ============================================

export const NEXX_TEMPLATES = {
  // Orders & Estimates
  estimate: ESTIMATE_TEMPLATE,
  ticket: TICKET_TEMPLATE,
  work_order: WORK_ORDER_TEMPLATE,
  // Invoices
  invoice: INVOICE_TEMPLATE,
  payment_receipt: PAYMENT_RECEIPT_TEMPLATE,
  // Sales
  sale_invoice: SALE_INVOICE_TEMPLATE,
  // Service documents
  intake: INTAKE_TEMPLATE,
  release: RELEASE_TEMPLATE,
  warranty: WARRANTY_TEMPLATE,
  buyback: BUYBACK_TEMPLATE,
  recycling: RECYCLING_TEMPLATE,
};

export default NEXX_TEMPLATES;
