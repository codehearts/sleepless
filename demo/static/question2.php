<?php require_once 'framework.php'; ?>
<?php get_header('Hebrew | Now Studying | Sleepless Demo', '', 'study-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field center-field rtl">בקבוק</span>
			<span class="card-field small-field center-field">bokbuk</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer2.php" class="is-muted">
			<button type="submit" class="btn mega-btn" id="show-answer" name="show-answer">Show Answer</button>
		</form>
	</section>
<?php get_footer('study'); ?>