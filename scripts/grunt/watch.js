// Hint: newer:taskName - configure Grunt tasks to run with newer files only.
module.exports = {
    scripts: {
        files: ['<%= path.src %>app/**/*.{js,html}',
                '<%= path.src %>assets/js/ui/*.js',
                '<%= path.src %>assets/img/*',
                '<%= path.src %>assets/scss/**/*.scss',
                '<%= path.src %>*.html'],
        tasks: ['sass',
                'newer:copy',
                'newer:imagemin',
                'newer:htmlmin',
                'autoprefixer'],
        options: {
            nospawn: true,
            debounceDelay: 250,
            livereload: true
        }
    }
};
