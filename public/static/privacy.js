// Privacy Policy Page - NEXX v9.0
const { useState } = React;

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-shield-alt"></i>
              <span>Конфіденційність</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Політика <span className="text-blue-600">конфіденційності</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Ми цінуємо вашу довіру і гарантуємо повну конфіденційність ваших даних
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
                  <i className="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Загальні положення</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Ця Політика конфіденційності регулює порядок збору, зберігання, використання та захисту 
                  персональних даних користувачів сервісу NEXX (далі — "Сервіс").
                </p>
                <p>
                  Використовуючи наш веб-сайт або послуги, ви погоджуєтесь з умовами цієї Політики 
                  конфіденційності та надаєте згоду на обробку ваших персональних даних.
                </p>
                <p>
                  <strong>NEXX</strong> зобов'язується дотримуватися законодавства України про захист 
                  персональних даних та забезпечувати конфіденційність інформації користувачів.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-database text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Які дані ми збираємо</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Ми можемо збирати наступні категорії персональних даних:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Контактна інформація:</strong> ім'я, прізвище, номер телефону, email-адреса</li>
                  <li><strong>Інформація про пристрій:</strong> модель, серійний номер, IMEI, стан пристрою</li>
                  <li><strong>Історія замовлень:</strong> дата звернення, вид ремонту, вартість, статус</li>
                  <li><strong>Технічні дані:</strong> IP-адреса, тип браузера, час відвідування сайту</li>
                  <li><strong>Фото та відео:</strong> фіксація стану пристрою до та після ремонту</li>
                </ul>
                <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Ми НЕ збираємо фінансову інформацію (номери карток), паролі від пристроїв та особисті 
                  файли з вашого телефону або комп'ютера.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-bullseye text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Для чого ми використовуємо дані</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Ваші персональні дані використовуються виключно для:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Надання послуг з ремонту та обслуговування техніки</li>
                  <li>Зв'язку з вами щодо статусу замовлення</li>
                  <li>Виставлення рахунків та здійснення платежів</li>
                  <li>Покращення якості сервісу та персоналізації пропозицій</li>
                  <li>Виконання гарантійних зобов'язань</li>
                  <li>Розсилки інформаційних повідомлень (за вашою згодою)</li>
                  <li>Дотримання вимог законодавства України</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Захист даних</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших даних:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Шифрування даних при передачі (SSL/TLS)</li>
                  <li>Обмеження доступу співробітників до персональних даних</li>
                  <li>Регулярні резервні копії бази даних</li>
                  <li>Відеоспостереження у приміщенні сервісного центру</li>
                  <li>Захищене зберігання паперових документів</li>
                  <li>Регулярний аудит систем безпеки</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-share-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Розголошення даних третім особам</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Ми НЕ продаємо, не обмінюємо та не передаємо ваші персональні дані третім особам без вашої згоди.
                </p>
                <p>Виняток становлять випадки, коли розголошення необхідне для:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Виконання законних вимог органів державної влади</li>
                  <li>Захисту наших прав та інтересів</li>
                  <li>Співпраці з постачальниками запчастин (тільки технічна інформація про пристрій)</li>
                </ul>
                <p className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <i className="fas fa-check-circle text-green-600 mr-2"></i>
                  Всі наші партнери підписують угоди про нерозголошення інформації.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-check text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Ваші права</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Згідно з законодавством України, ви маєте право:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Знати, які дані про вас ми зберігаємо</li>
                  <li>Вимагати виправлення неточних даних</li>
                  <li>Вимагати видалення ваших даних (за винятком даних, необхідних для гарантії)</li>
                  <li>Відкликати згоду на обробку персональних даних</li>
                  <li>Подати скаргу до Уповноваженого Верховної Ради України з прав людини</li>
                </ul>
                <p>
                  Для реалізації ваших прав зверніться до нас за контактами, вказаними нижче.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Строки зберігання даних</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Контактні дані:</strong> зберігаються протягом 3 років після останнього звернення</li>
                  <li><strong>Історія ремонтів:</strong> зберігається 3 роки (для гарантійних випадків)</li>
                  <li><strong>Фото/відео:</strong> зберігаються протягом гарантійного періоду (30 днів) + 60 днів</li>
                  <li><strong>Технічні логи:</strong> автоматично видаляються через 6 місяців</li>
                </ul>
                <p>
                  Після закінчення терміну зберігання дані видаляються або анонімізуються.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-edit text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">8. Зміни в Політиці</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Ми залишаємо за собою право вносити зміни до цієї Політики конфіденційності. 
                  Всі зміни набувають чинності з моменту їх публікації на цій сторінці.
                </p>
                <p>
                  Рекомендуємо періодично переглядати цю сторінку для ознайомлення з актуальною версією Політики.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Контакти</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> <a href="mailto:privacy@nexx.ua" className="text-blue-600 hover:underline">privacy@nexx.ua</a></p>
                    <p><strong>Телефон:</strong> <a href="tel:+380000000000" className="text-blue-600 hover:underline">+380 00 000 0000</a></p>
                    <p><strong>Адреса:</strong> м. Київ, вул. Прикладна, 1</p>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">
                    З питань, пов'язаних із захистом персональних даних, звертайтеся за вказаними контактами.
                  </p>
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
root.render(<PrivacyPage />);
