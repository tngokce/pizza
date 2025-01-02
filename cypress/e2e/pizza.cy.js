describe('Pizza Order Form', () => {
  beforeEach(() => {
    cy.visit('/order')
  })

  it('should allow text input', () => {
    // İsim alanını test edelim
    cy.get('input[name="name"]')
      .type('Jo')
      .should('have.value', 'Jo')
      // 2 karakterde hata mesajı görünmeli
      .parent()
      .should('contain', 'İsim en az 3 karakter olmalıdır')
      
    // 3 karakter girince hata mesajı kalkmalı
    cy.get('input[name="name"]')
      .type('John')
      .should('have.value', 'John')
      .parent()
      .should('not.contain', 'İsim en az 3 karakter olmalıdır')
  })

  it('should allow multiple topping selection', () => {
    // 3 malzeme seçildiğinde submit butonu disabled olmalı
    cy.get('input[type="checkbox"]').first().click()
    cy.get('input[type="checkbox"]').eq(1).click()
    cy.get('input[type="checkbox"]').eq(2).click()
    cy.get('button[type="submit"]').should('be.disabled')

    // 4 malzeme seçildiğinde ve diğer alanlar doluysa submit butonu enabled olmalı
    cy.get('input[name="name"]').type('John')
    cy.get('input[type="radio"]').first().click()
    cy.get('input[type="checkbox"]').eq(3).click()
    cy.get('button[type="submit"]').should('not.be.disabled')

    // 11 malzeme seçilmeye çalışıldığında hata vermeli
    cy.get('input[type="checkbox"]').each(($el, index) => {
      if (index < 11) {
        cy.wrap($el).click()
      }
    })
    cy.get('.error-message').should('contain', 'En fazla 10 malzeme seçebilirsiniz')
  })

  it('should handle pizza size selection', () => {
    // Varsayılan olarak hiçbir boyut seçili olmamalı
    cy.get('input[type="radio"]').should('not.be.checked')

    // Küçük boy seçimi
    cy.get('input[value="Küçük"]').click()
    cy.get('input[value="Küçük"]').should('be.checked')
    cy.get('input[value="Orta"]').should('not.be.checked')
    cy.get('input[value="Büyük"]').should('not.be.checked')

    // Orta boy seçimi
    cy.get('input[value="Orta"]').click()
    cy.get('input[value="Küçük"]').should('not.be.checked')
    cy.get('input[value="Orta"]').should('be.checked')
    cy.get('input[value="Büyük"]').should('not.be.checked')

    // Büyük boy seçimi
    cy.get('input[value="Büyük"]').click()
    cy.get('input[value="Küçük"]').should('not.be.checked')
    cy.get('input[value="Orta"]').should('not.be.checked')
    cy.get('input[value="Büyük"]').should('be.checked')
  })

  it('should submit form successfully and log response', () => {
    // Console mesajlarını yakala
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
      cy.spy(win.console, 'error').as('consoleError');
    });

    // Form'u doldur
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[value="Orta"]').click();
    
    // 4 malzeme seç
    cy.get('input[type="checkbox"]').each(($el, index) => {
      if (index < 4) cy.wrap($el).click();
    });

    // Not ekle
    cy.get('textarea[name="note"]').type('Lütfen az pişmiş olsun');

    // API isteğini bekle
    cy.intercept('POST', 'https://reqres.in/api/pizza').as('submitForm');

    // Formu gönder
    cy.get('button[type="submit"]').click();

    // API yanıtını bekle ve kontrol et
    cy.wait('@submitForm').then((interception) => {
      // Console.log çağrılarını kontrol et
      cy.get('@consoleLog').should('be.calledWith', 'API Yanıtı:', interception.response.body);
      cy.get('@consoleLog').should('be.calledWith', 'Sipariş Özeti:', {
        isim: 'John Doe',
        boyut: 'Orta',
        malzemeler: ['Pepperoni', 'Mantar', 'Soğan', 'Sucuk'],
        not: 'Lütfen az pişmiş olsun'
      });

      // Başarılı yanıt sonrası success sayfasına yönlendirme
      cy.url().should('include', '/success');
      
      // Başarı mesajını kontrol et
      cy.get('.Toastify').should('contain', 'Siparişiniz başarıyla alındı!');
    });
  });

  it('should handle notes textarea', () => {
    const testNote = 'Lütfen pizzamı az pişmiş hazırlar mısınız? Ekstra sos istiyorum.';
    
    // Textarea'ya not yazma
    cy.get('textarea[name="note"]')
      .type(testNote)
      .should('have.value', testNote);

    // Karakter sayısı kontrolü
    cy.get('.char-count')
      .should('contain', `${testNote.length}/200`);

    // 200 karakterden fazla yazılamamalı
    const longText = 'a'.repeat(201);
    cy.get('textarea[name="note"]')
      .clear()
      .type(longText)
      .should('have.value', longText.slice(0, 200));
  });

  it('should handle topping selection with validation', () => {
    // Başlangıçta submit butonu disabled olmalı
    cy.get('button[type="submit"]').should('be.disabled');

    // Malzeme seçimlerini test et
    const toppings = ["Pepperoni", "Mantar", "Soğan", "Sucuk", "Zeytin"];

    // 3 malzeme seç - hala yetersiz olmalı
    toppings.slice(0, 3).forEach(topping => {
      cy.contains('label', topping).click();
    });
    cy.get('.error-message').should('contain', 'En az 4 malzeme seçmelisiniz');

    // 4. malzemeyi seç - yeterli olmalı
    cy.contains('label', toppings[3]).click();
    cy.get('.error-message').should('not.exist');

    // 10'dan fazla malzeme seçmeye çalış
    cy.get('input[type="checkbox"]').each(($el, index) => {
      if (index < 11) cy.wrap($el).click();
    });
    cy.get('.error-message').should('contain', 'En fazla 10 malzeme seçebilirsiniz');

    // Fazla malzemeleri seçememe kontrolü
    cy.get('input[type="checkbox"]')
      .not(':checked')
      .should('be.disabled');
  });

  it('should submit form with complete validation', () => {
    // Form validasyonunu test et
    const testData = {
      name: 'John Doe',
      size: 'Orta',
      toppings: ["Pepperoni", "Mantar", "Soğan", "Sucuk"],
      note: 'Test notu'
    };

    // İsim gir
    cy.get('input[name="name"]')
      .type(testData.name)
      .should('have.value', testData.name);

    // Boyut seç
    cy.contains('label', testData.size).click();
    cy.get(`input[value="${testData.size}"]`).should('be.checked');

    // Malzemeleri seç
    testData.toppings.forEach(topping => {
      cy.contains('label', topping).click();
    });

    // Not ekle
    cy.get('textarea[name="note"]')
      .type(testData.note)
      .should('have.value', testData.note);

    // API isteğini bekle
    cy.intercept('POST', 'https://reqres.in/api/pizza').as('submitForm');

    // Submit butonunun aktif olduğunu kontrol et
    cy.get('button[type="submit"]')
      .should('not.be.disabled')
      .click();

    // API yanıtını ve yönlendirmeyi kontrol et
    cy.wait('@submitForm').then((interception) => {
      // Request body kontrolü
      expect(interception.request.body).to.deep.equal({
        name: testData.name,
        size: testData.size,
        toppings: testData.toppings,
        note: testData.note
      });

      // Başarılı yanıt kontrolü
      expect(interception.response.statusCode).to.equal(201);
      
      // Yönlendirme kontrolü
      cy.url().should('include', '/success');
      
      // Toast mesajı kontrolü
      cy.get('.Toastify').should('contain', 'Siparişiniz başarıyla alındı!');
    });
  });
}) 