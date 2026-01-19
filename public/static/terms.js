// Terms of Service Page - NEXX v9.0
const { useState } = React;

function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-file-contract"></i>
              <span>Юридична інформація</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Умови <span className="text-blue-600">користування</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Правила та умови надання послуг сервісного центру NEXX
            </p>
            
            <div className="mt-6 text-sm text-gray-500">
              Остання редакція: <span className="font-semibold">19 січня 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-handshake text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Загальні положення</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Ці Умови користування (далі — "Угода") регулюють відносини між сервісним центром 
                  <strong> NEXX</strong> (далі — "Виконавець") та клієнтом (далі — "Замовник") щодо 
                  надання послуг з ремонту та обслуговування електронної техніки.
                </p>
                <p>
                  Передаючи пристрій на ремонт або використовуючи наші послуги, Замовник підтверджує, 
                  що ознайомився з цією Угодою та повністю приймає її умови.
                </p>
                <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                  <strong>Важливо:</strong> Уважно прочитайте ці умови перед використанням наших послуг.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clipboard-list text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Послуги Виконавця</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Виконавець надає наступні послуги:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Безкоштовна діагностика несправностей пристроїв</li>
                  <li>Ремонт телефонів, планшетів, ноутбуків та іншої техніки</li>
                  <li>Заміна компонентів та запчастин</li>
                  <li>Професійна чистка пристроїв</li>
                  <li>Апгрейд та модернізація техніки</li>
                  <li>Консультації щодо експлуатації та обслуговування</li>
                </ul>
                <p>
                  Детальний перелік послуг та їх вартість доступні на сайті або уточнюються при зверненні.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-shield text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Обов'язки та відповідальність сторін</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p><strong className="text-gray-900">3.1. Виконавець зобов'язується:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Провести якісну діагностику та озвучити вартість ремонту</li>
                  <li>Виконати ремонт у встановлені строки</li>
                  <li>Використовувати якісні запчастини та комплектуючі</li>
                  <li>Надати гарантію на виконані роботи (30 днів)</li>
                  <li>Забезпечити безпеку та конфіденційність даних Замовника</li>
                  <li>Повідомити про додаткові несправності, виявлені під час ремонту</li>
                </ul>

                <p className="mt-6"><strong className="text-gray-900">3.2. Замовник зобов'язується:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Надати правдиву інформацію про пристрій та обставини поломки</li>
                  <li>Зробити резервну копію даних перед передачею пристрою на ремонт</li>
                  <li>Оплатити послуги після завершення ремонту</li>
                  <li>Забрати пристрій протягом 30 днів після завершення ремонту</li>
                  <li>Підтвердити, що пристрій не знаходиться в розшуку та є його законним власником</li>
                </ul>

                <p className="mt-6"><strong className="text-gray-900">3.3. Виконавець НЕ несе відповідальності за:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Втрату даних, збережених на пристрої</li>
                  <li>Несправності, виявлені, але не узгоджені для ремонту</li>
                  <li>Пошкодження пристрою внаслідок невиконання рекомендацій щодо експлуатації</li>
                  <li>Несправності, що виникли після закінчення гарантійного терміну</li>
                  <li>Пошкодження або втрату пристрою внаслідок форс-мажорних обставин</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-shield-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Гарантія</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">4.1.</strong> Виконавець надає гарантію 30 днів на виконані 
                  роботи та встановлені запчастини (якщо інше не узгоджено окремо).
                </p>
                <p>
                  <strong className="text-gray-900">4.2.</strong> Гарантія НЕ поширюється на випадки:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Механічних пошкоджень (падіння, удар, потрапляння рідини)</li>
                  <li>Самостійного ремонту або втручання третіх осіб після нашого ремонту</li>
                  <li>Порушення правил експлуатації пристрою</li>
                  <li>Природного зносу компонентів (батарея, роз'єми тощо)</li>
                  <li>Використання неоригінальних аксесуарів та зарядних пристроїв</li>
                </ul>
                <p>
                  <strong className="text-gray-900">4.3.</strong> Для використання гарантії необхідно надати 
                  квитанцію про виконаний ремонт.
                </p>
                <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Гарантійний ремонт виконується безкоштовно протягом 1-3 робочих днів.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-dollar-sign text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Оплата послуг</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">5.1.</strong> Оплата послуг здійснюється після завершення 
                  ремонту та тестування пристрою.
                </p>
                <p>
                  <strong className="text-gray-900">5.2.</strong> Приймаються наступні способи оплати: готівка, 
                  банківські картки, безготівковий розрахунок (для юридичних осіб).
                </p>
                <p>
                  <strong className="text-gray-900">5.3.</strong> Якщо Замовник відмовляється від ремонту після 
                  діагностики — оплачується вартість діагностики (100 грн).
                </p>
                <p>
                  <strong className="text-gray-900">5.4.</strong> У випадку дострокового припинення ремонту за 
                  ініціативою Замовника — оплачуються фактично виконані роботи та використані запчастини.
                </p>
                <p>
                  <strong className="text-gray-900">5.5.</strong> Вартість ремонту може бути змінена у випадку 
                  виявлення додаткових несправностей (за згодою Замовника).
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Строки виконання та зберігання</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">6.1.</strong> Орієнтовний термін ремонту — 30-120 хвилин 
                  для стандартних робіт. Точний термін повідомляється після діагностики.
                </p>
                <p>
                  <strong className="text-gray-900">6.2.</strong> Складні ремонти можуть займати від 1 до 14 робочих днів 
                  (залежно від наявності запчастин та складності робіт).
                </p>
                <p>
                  <strong className="text-gray-900">6.3.</strong> Пристрій зберігається безкоштовно протягом 
                  30 календарних днів після завершення ремонту.
                </p>
                <p>
                  <strong className="text-gray-900">6.4.</strong> Якщо Замовник не забирає пристрій протягом 
                  30 днів, стягується плата за зберігання 50 грн/добу.
                </p>
                <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                  <strong>Увага:</strong> Якщо пристрій не буде забрано протягом 90 днів, він може бути 
                  утилізований або реалізований для покриття витрат на зберігання.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-redo text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Відмова від послуг та повернення коштів</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">7.1.</strong> Замовник може відмовитися від ремонту на 
                  будь-якому етапі до початку робіт.
                </p>
                <p>
                  <strong className="text-gray-900">7.2.</strong> Якщо роботи вже розпочато, Замовник оплачує 
                  фактично виконаний обсяг робіт та використані матеріали.
                </p>
                <p>
                  <strong className="text-gray-900">7.3.</strong> Повернення коштів можливе у випадку неможливості 
                  виконання ремонту з вини Виконавця (протягом 14 днів).
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-gavel text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">8. Вирішення спорів</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">8.1.</strong> Всі спори вирішуються шляхом переговорів між сторонами.
                </p>
                <p>
                  <strong className="text-gray-900">8.2.</strong> У випадку недосягнення згоди спір передається 
                  до суду за місцем знаходження Виконавця.
                </p>
                <p>
                  <strong className="text-gray-900">8.3.</strong> Замовник має право звернутися до Держпродспоживслужби 
                  України для захисту своїх прав як споживача.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-edit text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">9. Зміни в Угоді</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Виконавець залишає за собою право вносити зміни до цієї Угоди. Актуальна версія завжди 
                  доступна на сайті. Продовження використання послуг після внесення змін означає прийняття нових умов.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Реквізити та контакти</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Найменування:</strong> Сервісний центр NEXX</p>
                    <p><strong>Адреса:</strong> м. Київ, вул. Прикладна, 1</p>
                    <p><strong>Телефон:</strong> <a href="tel:+380000000000" className="text-blue-600 hover:underline">+380 00 000 0000</a></p>
                    <p><strong>Email:</strong> <a href="mailto:info@nexx.ua" className="text-blue-600 hover:underline">info@nexx.ua</a></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<TermsPage />);
