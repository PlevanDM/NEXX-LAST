import React from 'react';
import { Icons } from './Icons';
import { SchematicResource, RepairGuide, ConnectorPinout } from '../types';

interface KnowledgeBaseProps {
  schematics: SchematicResource[];
  guides: RepairGuide[];
  pinouts: ConnectorPinout[];
  onClose: () => void;
}

type TabType = 'schematics' | 'guides' | 'pinouts' | 'tristar' | 'hydra' | 'baseband' | 'touch' | 'liquid' | 'nand' | 'tools';

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ schematics, guides, pinouts, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('schematics');
  const [search, setSearch] = React.useState('');

  const renderContent = () => {
    // TRISTAR вкладка
    if (activeTab === 'tristar') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">⚡ Tristar (U2/U4900) - Контроллер зарядки</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Устройство не заряжается или заряжается медленно</li>
                <li>Нестабильная зарядка (периодически отключается)</li>
                <li>Не распознает кабель/адаптер</li>
                <li>Нагрев в области U2/U4900</li>
                <li>Сообщение "Аксессуар не поддерживается"</li>
                <li>Зарядка работает только с определенными кабелями</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Проверить PPVBUS_MAIN (должно быть 5V при подключении зарядки)</li>
                <li>Измерить сопротивление на пинах Tristar (см. схему)</li>
                <li>Проверить короткое замыкание на SDA/SCL линиях I2C</li>
                <li>Проверить наличие напряжения на VDD_MAIN</li>
                <li>В 3uTools проверить логи зарядки</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Метод 1:</strong> Ребол Tristar (U2/U4900) с очисткой контактных площадок
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Метод 2:</strong> Замена Tristar на новую микросхему (требуется BGA станция)
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Метод 3:</strong> Проверка и замена компонентов зарядки (фильтры, резисторы)
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">BGA станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">DC Power Supply</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Схема платы</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // HYDRA вкладка
    if (activeTab === 'hydra') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">🔋 Hydra (U3300) - Контроллер питания USB-C</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>USB-C порт не работает (не заряжает, не передает данные)</li>
                <li>Устройство не распознается в iTunes/Finder</li>
                <li>Нагрев в области U3300</li>
                <li>Короткое замыкание на USB-C порту</li>
                <li>Зарядка работает, но данные не передаются (или наоборот)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Проверить PPVBUS_MAIN на коротко замыкание</li>
                <li>Измерить сопротивление CC1/CC2 линий</li>
                <li>Проверить I2C связь с Hydra (SDA/SCL)</li>
                <li>Визуально осмотреть USB-C порт на коррозию/повреждения</li>
                <li>Тестировать с известным рабочим кабелем USB-C</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Метод 1:</strong> Замена USB-C порта (если проблема в механическом повреждении)
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Метод 2:</strong> Ребол или замена Hydra U3300
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Метод 3:</strong> Проверка и замена фильтров USB-C линий
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">BGA станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">USB-C тестер</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Паяльник</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // BASEBAND вкладка
    if (activeTab === 'baseband') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">📶 Baseband - Проблемы с сетью</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>"Нет сети" / "Поиск..." постоянно</li>
                <li>Нет IMEI (0000000000000000)</li>
                <li>Серый значок WiFi/сотовой сети</li>
                <li>Не работает звонки/SMS/мобильные данные</li>
                <li>iPhone отключен после обновления iOS</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Проверить IMEI в Настройки → Основные → Об этом устройстве</li>
                <li>Восстановить iOS через iTunes/Finder</li>
                <li>Проверить baseband версию (должна быть не N/A)</li>
                <li>Проверить короткое замыкание на RF линиях</li>
                <li>Визуально осмотреть baseband микросхему и окружающие компоненты</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Метод 1:</strong> Ребол baseband микросхемы (Intel/Qualcomm)
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Метод 2:</strong> Замена baseband CPU (требуется донор и перепрограммирование)
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Метод 3:</strong> Проверка и замена RF фильтров/антенн
                </div>
                <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <strong>Программное:</strong> Восстановление baseband прошивки (iTunes restore)
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">BGA станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Программатор</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">iTunes/3uTools</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // TOUCH IC вкладка
    if (activeTab === 'touch') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">👆 Touch IC - Контроллер сенсора</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Сенсор не реагирует на касания</li>
                <li>Частичная работа тачскрина (работают только отдельные зоны)</li>
                <li>Фантомные касания / самопроизвольные нажатия</li>
                <li>Серая полоса в верхней части экрана (iPhone 6/6+)</li>
                <li>Touch ID не работает после замены экрана</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Проверить шлейф дисплея на повреждения</li>
                <li>Протестировать с другим экраном</li>
                <li>Визуально осмотреть Touch IC микросхемы на плате</li>
                <li>Проверить напряжение на линиях питания Touch IC</li>
                <li>Проверить короткое замыкание на I2C линиях сенсора</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Метод 1:</strong> Замена дисплея (если проблема в экране)
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Метод 2:</strong> Ребол Touch IC микросхем (Meson/Cumulus)
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Метод 3:</strong> Замена Touch IC микросхем (требуется микропайка)
                </div>
                <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <strong>Метод 4:</strong> Проверка и пайка шлейфа дисплея
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Паяльная станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">BGA станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">DC Power Supply</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // LIQUID DAMAGE вкладка
    if (activeTab === 'liquid') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">💧 Залитие - Диагностика и ремонт после контакта с жидкостью</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Устройство не включается после контакта с жидкостью</li>
                <li>Коррозия на контактах и компонентах</li>
                <li>Периодические перезагрузки и зависания</li>
                <li>Отсутствие изображения на экране</li>
                <li>Не работает зарядка или USB</li>
                <li>Нет звука / микрофона / динамика</li>
                <li>Короткое замыкание на плате (потребление тока без загрузки)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Визуальный осмотр платы на коррозию под микроскопом</li>
                <li>Проверка индикаторов контакта с жидкостью (LCI) - красные полоски</li>
                <li>Измерение коротких замыканий на основных линиях питания (PP_VDD_MAIN, PPVBUS, PP_BATT_VCC)</li>
                <li>Тестирование с подключением DC Power Supply (проверка потребления тока)</li>
                <li>Визуальная проверка шлейфов, коннекторов, защитных фильтров</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения и порядок действий:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Шаг 1:</strong> Немедленная разборка устройства (чем быстрее, тем лучше)
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Шаг 2:</strong> Ультразвуковая чистка платы в изопропиловом спирте 99%
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Шаг 3:</strong> Сушка платы (феном или в сушильном шкафу при 40-50°C)
                </div>
                <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <strong>Шаг 4:</strong> Визуальный осмотр под микроскопом - выявление поврежденных компонентов
                </div>
                <div className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                  <strong>Шаг 5:</strong> Замена поврежденных микросхем, фильтров, разъемов
                </div>
                <div className="p-2 bg-indigo-50 rounded border-l-4 border-indigo-400">
                  <strong>Шаг 6:</strong> Обработка платы антикоррозионным покрытием (лак)
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">❗ Важные предупреждения:</h4>
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                <ul className="space-y-1">
                  <li>• <strong>НЕ включать</strong> устройство сразу после контакта с жидкостью!</li>
                  <li>• <strong>НЕ заряжать</strong> до полной чистки и диагностики!</li>
                  <li>• Чем быстрее начать чистку - тем выше шанс восстановления</li>
                  <li>• Морская вода/сладкие напитки/кофе наносят больше вреда, чем чистая вода</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты и материалы:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Ультразвуковая ванна</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Изопропиловый спирт 99%</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп с подсветкой</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Антистатическая щетка</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">DC Power Supply</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Паяльная станция</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Антикоррозионное покрытие</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // NAND вкладка
    if (activeTab === 'nand') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">💾 NAND - Программирование и перенос данных</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Симптомы проблем с NAND:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Ошибка 9 или 4013 при восстановлении через iTunes</li>
                <li>Устройство застряло в режиме DFU или Recovery Loop</li>
                <li>Невозможность активации iPhone после восстановления</li>
                <li>Логотип Apple появляется и исчезает (бутлуп)</li>
                <li>iTunes не видит устройство или видит в режиме восстановления</li>
                <li>После замены NAND - потеря IMEI, SN, WiFi MAC адреса</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Диагностика:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Проверка NAND чипа на короткие замыкания (мультиметром)</li>
                <li>Считывание серийного номера NAND (с помощью программатора)</li>
                <li>Проверка питания NAND (VDD_MAIN линия должна быть 1.8V)</li>
                <li>Визуальный осмотр NAND под микроскопом на повреждения BGA шаров</li>
                <li>Попытка восстановления через iTunes/3uTools (ошибка 9/4013 указывает на NAND)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Решения:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong>Метод 1:</strong> Ребол NAND чипа (если проблема в отпайке шаров BGA)
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <strong>Метод 2:</strong> Замена NAND с переносом данных на новый чип (сохранение данных пользователя)
                </div>
                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                  <strong>Метод 3:</strong> Перепрограммирование NAND (восстановление системных разделов)
                </div>
                <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <strong>Метод 4:</strong> Расширение памяти (замена на NAND большего объема - 64GB→128GB)
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">⚠️ Важно при работе с NAND:</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-900">
                <ul className="space-y-1">
                  <li>• <strong>Backup обязателен!</strong> Перед заменой NAND сделайте резервную копию SYSCFG, NVRAM, Serial Number</li>
                  <li>• Используйте программаторы для чтения/записи NAND (Jcid, Qianli, IP-Box)</li>
                  <li>• Серийный номер, IMEI, WiFi/BT адреса хранятся в NAND - их нужно перенести</li>
                  <li>• После замены NAND нужна активация через iTunes</li>
                  <li>• Неправильное программирование = permanently locked iPhone</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Необходимые инструменты:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">NAND программатор (Jcid/Qianli/IP-Box)</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">BGA станция (для снятия/установки)</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Микроскоп</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">DC Power Supply</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">Мультиметр</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">iTunes/3uTools</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // TOOLS вкладка
    if (activeTab === 'tools') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-3">🔧 Инструменты для ремонта Apple устройств</h3>
            
            <div className="space-y-4">
              {/* Паяльное оборудование */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">🔥 Паяльное оборудование</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>Паяльная станция с горячим воздухом</strong> - Quick 861DW, AOYUE 968A+ (температура 200-450°C)</li>
                  <li><strong>BGA ребол станция</strong> - для снятия/установки процессоров, NAND, микросхем</li>
                  <li><strong>Паяльник с тонким жалом</strong> - Hakko FX-888D, ATTEN ST-50D (для точечной пайки)</li>
                  <li><strong>Преднагреватель платы</strong> - для равномерного прогрева перед BGA работой</li>
                  <li><strong>Инфракрасная станция (IR)</strong> - для снятия процессоров без повреждений</li>
                </ul>
              </div>

              {/* Измерительные приборы */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">📊 Измерительные приборы</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>Мультиметр</strong> - ANENG AN8008, UNI-T UT61E (для измерения напряжения, сопротивления, короткого замыкания)</li>
                  <li><strong>DC Power Supply</strong> - LONG WEI LW-K3010D, RD6006 (регулируемое питание 0-30V, 0-10A)</li>
                  <li><strong>Осциллограф</strong> - DSO138, Hantek DSO5102P (для диагностики сигналов)</li>
                  <li><strong>Термометр инфракрасный</strong> - для определения зон нагрева на плате</li>
                  <li><strong>USB тестер</strong> - для измерения тока зарядки и напряжения</li>
                </ul>
              </div>

              {/* Оптика */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">🔬 Оптика</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>Микроскоп с подсветкой</strong> - Trinocular 7-45X, Andonstar ADSM302 (обязателен для микропайки)</li>
                  <li><strong>Лупа с увеличением 10-20X</strong> - для визуального осмотра компонентов</li>
                  <li><strong>USB микроскоп</strong> - для записи процесса ремонта</li>
                </ul>
              </div>

              {/* Программное обеспечение */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">💻 Программное обеспечение</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>3uTools</strong> - диагностика iPhone, проверка батареи, восстановление iOS, чтение логов</li>
                  <li><strong>iTunes / Finder</strong> - восстановление iOS, обновление прошивки</li>
                  <li><strong>iMazing</strong> - продвинутое управление iPhone, backup, извлечение данных</li>
                  <li><strong>Schematic Viewer</strong> - ZXW Tools, Boardview (для работы со схемами плат)</li>
                  <li><strong>NAND программаторы</strong> - Jcid, Qianli iCopy Plus, IP-Box</li>
                </ul>
              </div>

              {/* Расходные материалы */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">🧰 Расходные материалы</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>Припой</strong> - AMTECH NC-559-ASM, Mechanic XG-50 (флюс-паста)</li>
                  <li><strong>BGA шары</strong> - 0.25mm, 0.3mm, 0.35mm, 0.4mm, 0.45mm, 0.5mm, 0.6mm</li>
                  <li><strong>Изопропиловый спирт 99%</strong> - для очистки платы после пайки</li>
                  <li><strong>Термопаста</strong> - Arctic MX-4, Thermal Grizzly (для процессоров)</li>
                  <li><strong>Трафареты BGA</strong> - для установки шаров на микросхемы</li>
                  <li><strong>Антистатические щетки</strong> - для чистки платы</li>
                  <li><strong>Капток лента (Kapton)</strong> - термостойкая лента для защиты компонентов</li>
                </ul>
              </div>

              {/* Инструменты разборки */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-bold text-slate-800 mb-2">🔩 Инструменты разборки</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li><strong>Набор отверток</strong> - Pentalobe P2/P5, Tri-point Y000, Phillips PH000</li>
                  <li><strong>Пластиковые лопатки</strong> - для открытия корпуса без царапин</li>
                  <li><strong>Присоски</strong> - для снятия дисплея iPhone</li>
                  <li><strong>Пинцеты</strong> - прямые, изогнутые, антистатические</li>
                  <li><strong>iSclack</strong> - для безопасного открытия iPhone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'schematics') {
      const filtered = schematics.filter(s => 
        s.model.toLowerCase().includes(search.toLowerCase()) || 
        (s.board_number && s.board_number.includes(search))
      );
      return (
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
              <div>
                <div className="font-medium text-slate-800">{s.model}</div>
                {s.board_number && <div className="text-xs font-mono text-slate-500">{s.board_number}</div>}
              </div>
              <div className="flex gap-2">
                {s.schematic_url && <a href={s.schematic_url} target="_blank" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Схема</a>}
                {s.boardview_url && <a href={s.boardview_url} target="_blank" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">Boardview</a>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'guides') {
      const filtered = guides.filter(g => 
        g.title.toLowerCase().includes(search.toLowerCase()) || 
        g.category.toLowerCase().includes(search.toLowerCase())
      );
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((g, i) => (
            <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">{g.category}</div>
              <h3 className="font-bold text-slate-800 mb-2">{g.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3">{g.description}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'pinouts') {
      const filtered = pinouts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.device.toLowerCase().includes(search.toLowerCase())
      );
      return (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-800">{p.name} ({p.device})</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(p.pins).slice(0, 8).map(([pin, desc]) => (
                  <div key={pin} className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-mono text-slate-500">{pin}</span>
                    <span className="font-medium text-slate-700">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-indigo-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Book /> База Знаний
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="bg-slate-50 p-2 flex gap-2 border-b border-slate-200 overflow-x-auto flex-wrap">
        {[
          { id: 'schematics', label: '📋 Схемы' },
          { id: 'guides', label: '📖 Гайды' },
          { id: 'pinouts', label: '🔌 Распиновки' },
          { id: 'tristar', label: '⚡ Tristar' },
          { id: 'hydra', label: '🔋 Hydra' },
          { id: 'baseband', label: '📶 Baseband' },
          { id: 'touch', label: '👆 Touch IC' },
          { id: 'liquid', label: '💧 Залитие' },
          { id: 'nand', label: '💾 NAND' },
          { id: 'tools', label: '🔧 Инструменты' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-w-[120px] ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-b border-slate-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {renderContent()}
      </div>
    </div>
  );
};
